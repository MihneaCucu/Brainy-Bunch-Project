const { GraphQLInt, GraphQLError } = require('graphql');
const DirectorPayload = require('../../types/DirectorPayload');
const db = require('../../../models');

const Director = {
    type: DirectorPayload,
    args: {
        id: {
            type: GraphQLInt,
        },
    },
    resolve: async (_, args) => {
        checkAuth(context);
        
        const { id } = args;

        const director = await db.Director.findByPk(id, {
            include: [{ model: db.Movie, as: 'movies' }]
        });

        if(!director) {
            throw new GraphQLError("Director not found");
        }

        return director;
    }
};

module.exports = Director;

