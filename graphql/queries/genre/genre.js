const {
    GraphQLInt,
    GraphQLError,
} = require('graphql');
const GenrePayload = require('../../types/GenrePayload');
const db = require('../../../models');

const Genre = {
    type: GenrePayload,
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

module.exports = Genre;