const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');
const {checkAuth} = require('../../../utils/auth');

const CreateComment = {
    type: CommentPayload,
    args: {
        reviewId: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },

    resolve: async (_, args, context) => {
        checkRole(context, ['user', 'moderator', 'admin']);

        if (!args.content.trim()) {
            throw new Error("Content cannot be empty");
        }

        const review = await db.Review.findByPk(args.reviewId);
        if (!review) {
            throw new Error("Review not found");
        }


        const now = new Date();

        const comment = await db.Comment.create({
            reviewId: args.reviewId,
            content: args.content,
            userId: context.user.id,
            createdAt: now,
            updatedAt: now,
        });

        return await db.Comment.findByPk(comment.id, {
            include: [
                {model: db.User, as: 'user'},
                {model: db.Review, as: 'review'}
            ],
        });
    },
};

module.exports = CreateComment;