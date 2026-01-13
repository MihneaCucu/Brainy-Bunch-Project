const { GraphQLObjectType, GraphQLID, GraphQLList } = require('graphql');
const db = require('../../models');

const DiaryPayload = new GraphQLObjectType({
    name: 'Diary',
    fields: () => {
         const UserPayload = require('./UserPayload');
         const MoviePayload = require('./MoviePayload');
         return {
            id: { type: GraphQLID },
            user: {
                type: UserPayload,
                resolve: (parent) => {
                    return db.User.findByPk(parent.userId);
                }
            },
            movies: {
                type: new GraphQLList(MoviePayload),
                resolve: async (parent) => {

                    const diaryId = parent.id;
                    const movieDiaryRows = await db.MovieDiary.findAll({
                        where: { diaryId },
                        order: [['watchedAt', 'DESC']],
                        raw: true
                    });

                    const movieIds = movieDiaryRows.map(r => r.movieId);
                    if (movieIds.length === 0){
                        return [];
                    }

                    const movies = await db.Movie.findAll({
                        where: { id: movieIds },
                        include: [
                            { model: db.Director, as: 'director' },
                            { model: db.Actor, as: 'actors' },
                            { model: db.Genre, as: 'genres' }
                        ]
                    });
                    const movieMap = {};
                    movies.forEach(m => { movieMap[m.id] = m; });

                    const allReviews = await db.Review.findAll({
                        where: { movieId: movieIds },
                        include: [{ model: db.User, as: 'user' }]
                    });

                    const reviewsByMovie = {};
                    const ownerReviewMap = {};
                    allReviews.forEach(r => {
                        if (!reviewsByMovie[r.movieId]) {
                            reviewsByMovie[r.movieId] = [];
                        }
                        reviewsByMovie[r.movieId].push(r);

                        if (r.userId === parent.userId) {
                            ownerReviewMap[r.movieId] = r;
                        }
                    });

                    return movieDiaryRows.map(row => {
                        const movie = movieMap[row.movieId];
                        if (!movie) return null;

                        const movieData = movie.get ? movie.get({ plain: true }) : movie.toJSON();

                        movieData.watchedAt = row.watchedAt;
                        movieData.reviews = reviewsByMovie[row.movieId] || [];
                        movieData.review = ownerReviewMap[row.movieId] || null;

                        return movieData;
                    }).filter(m => m !== null);
                }
            }
         };
    }
});

module.exports = DiaryPayload;