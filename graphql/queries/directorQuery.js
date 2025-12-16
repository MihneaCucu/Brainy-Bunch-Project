const { GraphQLInt, GraphQLError } = require('graphql');
const DirectorType = require('../types/DirectorType');
const db = require('../../models');

const directorQuery = {
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

module.exports = directorQuery;

