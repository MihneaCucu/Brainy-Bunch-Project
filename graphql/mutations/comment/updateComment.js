const {GraphQLString, GraphQLNonNull} = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');
const {checkRole} = require('../../../utils/auth');

const UpdateComment = {
    type: CommentPayload,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['user']);

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
            include: [{model: db.User, as: 'user'}],
        });
    },
};

module.exports = UpdateComment;