const {GraphQLInt, GraphQLError } = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');

const comment = {
    type: CommentPayload,
    args: {
        id: {
            type: GraphQLInt
        }
    },
    resolve: async (_, args) => {
        const { id } = args;

        const comment = await db.Comment.findByPk(id, {
            include: [
                { model: db.User, as: 'user' },
                { model: db.Review, as: 'review' }
            ]
        });

        if (!comment) {
            throw new GraphQLError("Not found");
        }

        return comment;
    }
}

module.exports = comment;