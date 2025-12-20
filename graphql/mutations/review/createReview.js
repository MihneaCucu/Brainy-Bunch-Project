const {GraphQLString, GraphQLNonNull} = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const db = require('../../../models');
const {checkRole} = require('../../../utils/auth');

const CreateReview = {
    type: ReviewPayload,
    args: {
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },

    resolve: async (_, args, context) => {

        const now = new Date();

        checkRole(context, ['user', 'moderator', 'admin']);

        const review = await db.Review.create({
            content: args.content,
            userId: context.user.id,
            createdAt: now,
            updatedAt: now,
        });

        return await db.Review.findByPk(review.id, {
            include: [{model: db.User, as: 'user'}],
        });
    },
};

module.exports = CreateReview;