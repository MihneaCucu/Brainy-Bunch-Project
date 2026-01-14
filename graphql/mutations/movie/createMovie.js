const { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } = require("graphql");
const MoviePayload = require("../../types/MoviePayload");
const CreateMovieInput = require("../../inputTypes/movie/CreateMovieInput");
const db = require("../../../models");
const { checkRole } = require("../../../utils/auth");

const CreateMovie = {
  type: MoviePayload,
  args: {
    input: { type: new GraphQLNonNull(CreateMovieInput) },
  },

  resolve: async (_, args, context) => {
    checkRole(context, ['admin']);
    const input = args.input || {};
    const movie = await db.Movie.create({
      title: input.title,
      description: input.description,
      releaseYear: input.releaseYear,
      directorId: input.directorId,
    });


    if(input.genreIds && input.genreIds.length > 0){
      const data = input.genreIds.map((genreId) => ({
        movieId: movie.id,
        genreId: genreId,
      }));
      await db.MovieGenre.bulkCreate(data);
    }

    if (input.actorIds && input.actorIds.length > 0) {
      const data = input.actorIds.map((actorId) => ({
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
