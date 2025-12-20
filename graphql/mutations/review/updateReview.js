const {GraphQLString, GraphQLNonNull} = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const db = require('../../../models');
const {checkAuth} = require('../../../utils/auth');

const UpdateReview = {
    type: ReviewPayload,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    resolve: async (_, args, context) => {
        checkAuth(context, ['user']);

        const review = await db.Review.findByPk(args.id);
        if (!review) {
            throw new Error("Review not found");
        }

        const currentUserId = context.user.id;

        if (currentUserId !== review.userId) {
            throw new Error("You are not authorized to update this review.");
        }

        review.content = args.content;
        review.updatedAt = new Date();

        await review.save();

        return await db.Review.findByPk(review.id, {
            include: [{model: db.User, as: 'user'}],
        });
    },
};

module.exports = UpdateReview;