const {
    GraphQLInt,
    GraphQLError,
} = require('graphql');
const MoviePayload = require('../../types/MoviePayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const Movie = {
    type: MoviePayload,
    args: {
        id: {
            type: GraphQLInt,
        },
    },
    resolve: async (_, args, context) => {
        checkAuth(context);
        
        const { id } = args;

        const movie = await db.Movie.findByPk(id, {
            include: [
                { model: db.Director, as: 'director' },
                {
                    model: db.Review,
                    as: 'reviews',
                    include: [
                        { model: db.User, as: 'user' },
                        { model: db.Comment, as: 'comments' }
                    ]
                }
            ]
        });

        if(!movie) {
          throw new GraphQLError("Not found");
        }

        return movie;
    }
}

module.exports = Movie;