const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const AddMovieToMovieInput = require("../../inputTypes/movieList/AddMovieToMovieListInput");
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const AddMovieToMovieList = {
    type: MovieListPayload,
    args: {
        input: {type: new GraphQLNonNull(AddMovieToMovieInput)}
    },
    async resolve(parent, args, context) {
        checkAuth(context);
        const input = args.input;

        const movieList = await db.MovieList.findByPk(input.movieListId);

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (movieList.userId !== context.user.id) {
            throw new Error('You can only add movies to your own lists');
        }

        const movie = await db.Movie.findByPk(input.movieId);

        if (!movie) {
            throw new Error('Movie not found');
        }

        const existingEntry = await db.MovieListMovie.findOne({
            where: {
                movieListId: input.movieListId,
                movieId: input.movieId
            }
        });

        if (existingEntry) {
            throw new Error('Movie already exists in this list');
        }

        await db.MovieListMovie.create({
            movieListId: input.movieListId,
            movieId: input.movieId,
            note: input.note || null,
            addedAt: new Date(),
        });

        // Return the updated movie list with movies
        return await db.MovieList.findByPk(input.movieListId, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = AddMovieToMovieList;

