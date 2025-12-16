const { GraphQLInt, GraphQLError } = require('graphql');
const DirectorType = require('../../types/DirectorPayload');
const db = require('../../../models');

const Director = {
    type: DirectorType,
    args: {
        id: {
            type: GraphQLInt,
        },
    },
    resolve: async (_, args) => {
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

