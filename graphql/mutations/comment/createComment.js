const {GraphQLString, GraphQLNonNull} = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');
const {checkRole} = require('../../../utils/auth');

const CreateComment = {
    type: CommentPayload,
    args: {
        content: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },

    resolve: async (_, args, context) => {

        const now = new Date();

        checkRole(context, ['user', 'moderator', 'admin']);

        const comment = await db.Comment.create({
            content: args.content,
            userId: context.user.id,
            createdAt: now,
            updatedAt: now,
        });

        return await db.Comment.findByPk(comment.id, {
            include: [{model: db.User, as: 'user'}],
        });
    },
};

module.exports = CreateComment;