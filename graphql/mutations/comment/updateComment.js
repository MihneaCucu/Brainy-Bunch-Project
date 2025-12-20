const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');
const {checkAuth} = require('../../../utils/auth');

const UpdateComment = {
    type: CommentPayload,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    resolve: async (_, args, context) => {
        checkAuth(context, ['user']);

        if (!args.content.trim()) {
            throw new Error("Content cannot be empty");
        }

        const comment = await db.Comment.findByPk(args.id);
        if (!comment) {
            throw new Error("Comment not found");
        }

        const currentUserId = context.user.id;

        if (currentUserId !== comment.userId) {
            throw new Error("You are not authorized to update this comment.");
        }

        comment.content = args.content;
        comment.updatedAt = new Date();

        await comment.save();

        return await db.Comment.findByPk(comment.id, {
            include: [
                {model: db.User, as: 'user'},
                {model: db.Review, as: 'review'}
            ],
        });
    },
};

module.exports = UpdateComment;