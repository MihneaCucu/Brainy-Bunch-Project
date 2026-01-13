const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
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
                resolve: async (parent, args, context) => {
                    if (parent.getMovies){
                        return parent.getMovies();
                    }

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

                    const movies = await db.Movie.findAll({ where: { id: movieIds } });
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

                        const m = movie.toJSON();
                        m.watchedAt = row.watchedAt;
                        m.reviews = reviewsByMovie[row.movieId] || [];
                        m.review = ownerReviewMap[row.movieId] || null;
                        return m;
                    }).filter(m => m !== null);
                }
            }
         };
    }
});

module.exports = DiaryPayload;