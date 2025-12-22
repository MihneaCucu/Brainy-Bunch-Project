const { GraphQLString, GraphQLNonNull } = require("graphql");
const GenrePayload = require("../../types/GenrePayload");
const db = require("../../../models");
const { checkRole } = require('../../../utils/auth');

const CreateGenre = {
  type: GenrePayload,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  resolve: async (_, args, context) => {
    checkRole(context, ['admin']);

    const now = new Date();

    const genre = await db.Genre.create({
      name: args.name,
      createdAt: now,
      updatedAt: now,
    });

    return await db.Genre.findByPk(genre.id);
  },
};

module.exports = CreateGenre;
