const { GraphQLList } = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const Comments = {
    type: new GraphQLList(CommentPayload),
    resolve: async (_, args, context) => {
        checkAuth(context);
        
        return await db.Comment.findAll({
            include: [
                { model: db.User, as: 'user' },
                { model: db.Review, as: 'review' }
            ]
        });
    }
}

module.exports = Comments;