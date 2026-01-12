const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const db = require('../../../models');
const {checkAuth} = require('../../../utils/auth');

const UpdateReview = {
    type: ReviewPayload,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        score: {
            type: GraphQLInt,
        },
        content: {
            type: GraphQLString,
        },
    },
    resolve: async (_, args, context) => {
        checkAuth(context);

        const review = await db.Review.findByPk(args.id);
        if (!review) {
            throw new Error("Review not found");
        }

        const currentUserId = context.user.id;

        if (currentUserId !== review.userId) {
            throw new Error("You are not authorized to update this review.");
        }

        if (args.content !== undefined) {
            review.content = args.content;
        }
        if (args.score !== undefined) {
            review.score = args.score;
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