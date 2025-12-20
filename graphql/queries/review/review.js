const { GraphQLInt, GraphQLError  } = require('graphql');
const ReviewPayload = require('../../types/ReviewPayload');
const db = require('../../../models');

const review = {
    type: ReviewPayload,
    args: {
        id: {
            type: GraphQLInt
        }
    },
    resolve: async (_, args) => {
        const { id } = args;

        const review = await db.Review.findByPk(id, {
            include: [
                { model: db.Movie, as: 'movie' },
                { model: db.Comment, as: 'comments' },
                { model: db.User, as: 'user' }
            ]
        });

        if(!review) {
            throw new GraphQLError("Not found");
        }

        return review;
    }
};

module.exports = review;
