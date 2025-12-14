const {
    GraphQLInt,
    GraphQLError,
} = require('graphql');
const GenreType = require('../types/GenreType');
const db = require('../../models');

const genreQuery = {
    type: GenreType,
    args: {
        id: {
            type: GraphQLInt,
        },
    },
    resolve: async (_, args) => {
        const { id } = args;

        const genre = await db.Genre.findByPk(id);

        if(!genre) {
          throw new GraphQLError("Not found");
        }

        return genre;
    }
}

module.exports = genreQuery;