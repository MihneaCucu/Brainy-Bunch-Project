const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const MoviePayload = require('../../types/MoviePayload');
const UpdateMovieInput = require("../../inputTypes/movie/UpdateMovieInput");
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const UpdateMovie = {
    type: MoviePayload,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        input: {type: UpdateMovieInput},
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);
        const input = args.input;

        const movie = await db.Movie.findByPk(args.id);
        if (!movie) {
            throw new Error("Movie not found");
        }

        if (input.title !== undefined) movie.title = input.title;
        if (input.description !== undefined) movie.description = input.description;
        if (input.releaseYear !== undefined) movie.releaseYear = input.releaseYear;
        if (input.directorId !== undefined) movie.directorId = input.directorId;

        await movie.save();

        return await db.Movie.findByPk(movie.id, {
            include: [{ model: db.Director, as: 'director' }]
        });
    }
};

module.exports = UpdateMovie;


