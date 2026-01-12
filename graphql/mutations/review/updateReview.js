const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const UpdateReviewInput = require("../../inputTypes/review/UpdateReviewInput");
const db = require('../../../models');
const {checkAuth} = require('../../../utils/auth');

const UpdateReview = {
    type: ReviewPayload,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        input: { type: new GraphQLNonNull(UpdateReviewInput) },
    },
    resolve: async (_, args, context) => {
        checkAuth(context);
        const input = args.input;

        const review = await db.Review.findByPk(args.id);
        if (!review) {
            throw new Error("Review not found");
        }

        const currentUserId = context.user.id;

        if (currentUserId !== review.userId) {
            throw new Error("You are not authorized to update this review.");
        }

        if (input.content !== undefined) {
            review.content = input.content;
        }
        if (input.score !== undefined) {
            review.score = input.score;
        }
        review.updatedAt = new Date();

        await review.save();

        return await db.Review.findByPk(review.id, {
            include: [
                {model: db.User, as: 'user'},
                {model: db.Movie, as: 'movie'},
                {model: db.Comment, as: 'comments'}
            ],
        });
    },
};

module.exports = UpdateReview;