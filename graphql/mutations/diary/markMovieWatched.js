const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const DiaryPayload = require('../../types/DiaryPayload');
const db = require('../../../models');
const ReviewInput = require('../../inputTypes/review/ReviewInput');
const { checkAuth } = require('../../../utils/auth');

const MarkMovieWatched = {
    type: DiaryPayload,
    args: {
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
        watchedAt: { type: GraphQLString },
        review: { type: ReviewInput }
    },
    async resolve(parent, args, context) {
        checkAuth(context)

        const movie = await db.Movie.findByPk(args.movieId);
        if (!movie){
            throw new Error("Movie not found");
        }

        let diary = await db.Diary.findOne({ where: { userId: context.user.id } });
        if (!diary) {
            diary = await db.Diary.create({ userId: context.user.id });
        }

        const existing = await db.MovieDiary.findOne({ where: { diaryId: diary.id, movieId: args.movieId } });
        if (existing) {
            throw new Error("Movie already marked as watched in your diary");
        }

        await db.MovieDiary.create({
            diaryId: diary.id,
            movieId: args.movieId,
            watchedAt: args.watchedAt ? new Date(args.watchedAt) : new Date(),
        });

        if (args.review && (args.review.score || args.review.content)) {
            await db.Review.create({
                movieId: args.movieId,
                userId: context.user.id,
                score: args.review.score || null,
                content: args.review.content || null,
            });
        }

        const userWatchlists = await db.Watchlist.findAll({
            where: { userId: context.user.id },
            include: [{
                model: db.Movie,
                as: 'movies',
                where: { id: args.movieId },
                required: true // Inner Join
            }]
        });

        if (userWatchlists.length > 0) {
            await Promise.all(userWatchlists.map(watchlist => {
                return watchlist.removeMovie(args.movieId);
            }));
        }

        return await db.Diary.findByPk(diary.id);
    }
};

module.exports = MarkMovieWatched;
