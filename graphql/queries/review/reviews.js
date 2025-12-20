const { GraphQLList } = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const db = require('../../../models');

const Reviews = {
    type: new GraphQLList(ReviewPayload),
    resolve: async () => {
        return await db.Review.findAll({
            include: [
                { model: db.Movie, as: 'movie' },
                { model: db.Comment, as: 'comments' },
                { model: db.User, as: 'user' }
            ]
        });
    }
}

module.exports = Reviews;