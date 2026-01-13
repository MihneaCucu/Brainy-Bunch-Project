const { GraphQLString, GraphQLNonNull } = require("graphql");
const GenrePayload = require("../../types/GenrePayload");
const db = require("../../../models");
const { checkRole } = require('../../../utils/auth');
const CreateGenreInput = require("../../inputTypes/genre/CreateGenreInput");

const CreateGenre = {
  type: GenrePayload,
  args: {
    input: {
      type: new GraphQLNonNull(CreateGenreInput),
    },
  },

  resolve: async (_, args, context) => {
    checkRole(context, ['admin']);

    const now = new Date();

    const genre = await db.Genre.create({
      name: args.input.name,
      createdAt: now,
      updatedAt: now,
    });

    return await db.Genre.findByPk(genre.id);
  },
};

module.exports = CreateGenre;
