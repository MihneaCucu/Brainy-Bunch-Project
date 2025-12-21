const { GraphQLInt, GraphQLNonNull } = require('graphql');
const GenrePayload = require('../../types/GenrePayload');
const UpdateGenreInput = require('../../inputTypes/UpdateGenreInput');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const UpdateGenre = {
    type: GenrePayload,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        input: { type: new GraphQLNonNull(UpdateGenreInput) },
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const genre = await db.Genre.findByPk(args.id);
        if (!genre) {
            throw new Error("Genre not found");
        }

        const { name } = args.input;

        if (name !== undefined) genre.name = name;

        genre.updatedAt = new Date();

        await genre.save();

        return await db.Genre.findByPk(genre.id);
    }
};

module.exports = UpdateGenre;


