const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const db = require('../../../models');

const AddMovieToMovieList = {
    type: MovieListPayload,
    args: {
        movieListId: { type: new GraphQLNonNull(GraphQLInt) },
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
        note: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
        if (!context.user) {
            throw new Error('You must be logged in to add movies to a list');
        }

        const movieList = await db.MovieList.findByPk(args.movieListId);

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (movieList.userId !== context.user.id) {
            throw new Error('You can only add movies to your own lists');
        }

        const movie = await db.Movie.findByPk(args.movieId);

        if (!movie) {
            throw new Error('Movie not found');
        }

        const existingEntry = await db.MovieListMovie.findOne({
            where: {
                movieListId: args.movieListId,
                movieId: args.movieId
            }
        });

        if (existingEntry) {
            throw new Error('Movie already exists in this list');
        }

        await db.MovieListMovie.create({
            movieListId: args.movieListId,
            movieId: args.movieId,
            note: args.note || null,
            addedAt: new Date(),
        });

        // Return the updated movie list with movies
        return await db.MovieList.findByPk(args.movieListId, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = AddMovieToMovieList;

