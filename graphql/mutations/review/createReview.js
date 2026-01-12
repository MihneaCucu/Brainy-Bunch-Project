const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const db = require('../../../models');
const {checkAuth} = require('../../../utils/auth');

const CreateReview = {
    type: ReviewPayload,
    args: {
        movieId: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        score: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },

    resolve: async (_, args, context) => {
        checkRole(context, ['user', 'moderator', 'admin']);

        if (args.score < 1 || args.score > 5) {
            throw new Error("Score must be between 1 and 5");
        }

        if (!args.content.trim()) {
            throw new Error("Content cannot be empty");
        }

        const movie = await db.Movie.findByPk(args.movieId);
        if (!movie) {
            throw new Error("Movie not found");
        }

        const existingReview = await db.Review.findOne({
            where: {
                userId: context.user.id,
                movieId: args.movieId
            }
        });

        if (existingReview) {
            throw new Error("You have already reviewed this movie");
        }

        const now = new Date();


        const review = await db.Review.create({
            movieId: args.movieId,
            score: args.score,
            content: args.content,
            userId: context.user.id,
            createdAt: now,
            updatedAt: now,
        });

        // Add movie to user's diary (mark as watched)
        // Get or create diary for user
        let diary = await db.Diary.findOne({
            where: { userId: context.user.id }
        });

        if (!diary) {
            diary = await db.Diary.create({
                userId: context.user.id
            });
        }

        // Check if movie is already in diary
        const existingEntry = await db.MovieDiary.findOne({
            where: {
                movieId: args.movieId,
                diaryId: diary.id
            }
        });

        // Add movie to diary if not already there
        if (!existingEntry) {
            await db.MovieDiary.create({
                movieId: args.movieId,
                diaryId: diary.id,
                watchedAt: now
            });
        }

        return await db.Review.findByPk(review.id, {
            include: [
                {model: db.User, as: 'user'},
                {model: db.Movie, as: 'movie'},
                {model: db.Comment, as: 'comments'}
            ],
        });
    },
};

module.exports = CreateReview;