const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const DiaryPayload = require('../../types/DiaryPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const Diary = {
    type: DiaryPayload,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    async resolve(_, args, context) {
        checkRole(context, ['admin']);

        const diary = await db.Diary.findByPk(args.id);
        if (!diary) {
            throw new Error("Diary not found");
        }

        const movieDiaryRows = await db.MovieDiary.findAll({
            where: { diaryId: diary.id },
            attributes: ['movieId', 'watchedAt'],
            order: [['watchedAt', 'DESC']],
            raw: true       // return as a simple JSON object
        });

        const movieIds = movieDiaryRows.map(r => r.movieId);

        const movies = movieIds.length ? await db.Movie.findAll({ where: { id: movieIds } }) : [];
        const movieMap = {};
        movies.forEach(m => { movieMap[m.id] = m; });

        const allReviews = movieIds.length ? await db.Review.findAll({ where: { movieId: movieIds }, include: [{ model: db.User, as: 'user' }] }) : [];
        const reviewsByMovie = {};
        const ownerReviewMap = {};
        allReviews.forEach(r => {
            if (!reviewsByMovie[r.movieId]) {
                reviewsByMovie[r.movieId] = [];
            }
            reviewsByMovie[r.movieId].push(r);
            if (r.userId === diary.userId) {
                ownerReviewMap[r.movieId] = r;
            }
        });

        diary.movies = movieDiaryRows.map((row, index) => {
            const movie = movieMap[row.movieId];
            if (!movie) return null;
            const m = movie.toJSON();
            m.watchedAt = row.watchedAt;
            m.reviews = reviewsByMovie[row.movieId] || [];
            m.review = ownerReviewMap[row.movieId] || null;
            return m;
        }).filter(m => m !== null);

        return diary;
    }
};

module.exports = Diary;
