const { GraphQLList } = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');

const Comments = {
    type: new GraphQLList(CommentPayload),
    resolve: async () => {
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