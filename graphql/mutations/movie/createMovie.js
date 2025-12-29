const { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } = require("graphql");
const MoviePayload = require("../../types/MoviePayload");
const db = require("../../../models");
const { checkRole } = require("../../../utils/auth");

const CreateMovie = {
  type: MoviePayload,
  args: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    releaseYear: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    directorId: {
      type: GraphQLInt,
    },
    genreId: {
      type: GraphQLInt,
    },
    actorIds: {
      type: new GraphQLList(GraphQLInt),
    }
  },

  resolve: async (_, args, context) => {
    checkRole(context, ['admin']);
    const movie = await db.Movie.create({
      title: args.title,
      description: args.description,
      releaseYear: args.releaseYear,
      directorId: args.directorId,
    });

    if (args.genreId) {
      await db.MovieGenre.create({
        movieId: movie.id,
        genreId: args.genreId,
      });
    }

    if (args.actorIds && args.actorIds.length > 0) {
      const data = args.actorIds.map((actorId) => ({
        movieId: movie.id,
        actorId: actorId,
      }));
      await db.MovieActor.bulkCreate(data);
    }

    return await db.Movie.findByPk(movie.id, {
      include: [
          { model: db.Director, as: "director" },
      ],
    });
  },
};

module.exports = CreateMovie;
