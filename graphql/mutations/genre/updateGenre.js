const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const GenrePayload = require('../../types/GenrePayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const UpdateGenre = {
    type: GenrePayload,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLString },
    },
    resolve: async (_, args, context) => {
        checkAuth(context, ['admin']);

        const genre = await db.Genre.findByPk(args.id);
        if (!genre) {
            throw new Error("Genre not found");
        }

        if (args.name !== undefined) genre.name = args.name;

        genre.updatedAt = new Date();

        await genre.save();

        return await db.Genre.findByPk(genre.id);
    }
};

module.exports = UpdateGenre;


