const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');
const {checkRole} = require('../../../utils/auth');
const UpdateCommentInput = require('../../inputTypes/comment/UpdateCommentInput');

const UpdateComment = {
    type: CommentPayload,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        input: {
            type: new GraphQLNonNull(UpdateCommentInput),
        }
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['user']);

        if (!args.input.content.trim()) {
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

        comment.content = args.input.content;
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