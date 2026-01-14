const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const CreateReviewInput = require("../../inputTypes/review/CreateReviewInput");
const db = require('../../../models');
const {checkRole} = require('../../../utils/auth');

const CreateReview = {
    type: ReviewPayload,
    args: {
        input: {type: new GraphQLNonNull(CreateReviewInput)},
    },

    resolve: async (_, args, context) => {
        checkRole(context, ['user', 'moderator', 'admin']);
        const input = args.input;

        if (input.score < 1 || input.score > 5) {
            throw new Error("Score must be between 1 and 5");
        }

        if (!input.content.trim()) {
            throw new Error("Content cannot be empty");
        }

        const movie = await db.Movie.findByPk(input.movieId);
        if (!movie) {
            throw new Error("Movie not found");
        }

        const existingReview = await db.Review.findOne({
            where: {
                userId: context.user.id,
                movieId: input.movieId
            }
        });

        if (existingReview) {
            throw new Error("You have already reviewed this movie");
        }

        const now = new Date();


        const review = await db.Review.create({
            movieId: input.movieId,
            score: input.score,
            content: input.content,
            userId: context.user.id,
            createdAt: now,
            updatedAt: now,
        });

    try {
        let diary = await db.Diary.findOne({ where: { userId: context.user.id } });
        if (!diary) diary = await db.Diary.create({ userId: context.user.id });

        const existingEntry = await db.MovieDiary.findOne({
            where: { movieId: input.movieId, diaryId: diary.id }
        });

        if (!existingEntry) {
            
            await db.MovieDiary.create({
                movieId: input.movieId,
                diaryId: diary.id,
                watchedAt: new Date()
            });
            
        } else {
            console.log("SKIPPING: Entry already exists in MovieDiaries");
        }
    } catch (error) {
        console.error("========================================");
        console.error("CRITICAL DATABASE ERROR:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.original) {
            console.error("SQL Error:", error.original.message); // SQLite specific error
        }
        console.error("========================================");
    }

        const userWatchlists = await db.Watchlist.findAll({
            where: { userId: context.user.id },
            include: [{
                model: db.Movie,
                as: 'movies',
                where: { id: input.movieId },
                required: true
            }]
        });

        if (userWatchlists.length > 0) {
            console.log(`Removing Movie ${input.movieId} from ${userWatchlists.length} Watchlist(s)...`);
            await Promise.all(userWatchlists.map(watchlist => {
                return watchlist.removeMovie(input.movieId);
            }));
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