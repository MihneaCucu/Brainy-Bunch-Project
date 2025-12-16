const {
    GraphQLInt,
    GraphQLError,
} = require('graphql');
const MovieType = require('../types/MovieType');
const db = require('../../models');

const movieQuery = {
    type: MovieType,
    args: {
        id: {
            type: GraphQLInt,
        },
    },
    resolve: async (_, args) => {
        const { id } = args;

        const movie = await db.Movie.findByPk(id, {
            include: [{ model: db.Director, as: 'director' }]
        });

        if(!movie) {
          throw new GraphQLError("Not found");
        }

        return movie;
    }
}

module.exports = movieQuery;