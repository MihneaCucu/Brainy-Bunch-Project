const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const RemoveMovieFromMovieList = {
    type: MovieListPayload,
    args: {
        movieListId: { type: new GraphQLNonNull(GraphQLInt) },
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
    },
    async resolve(parent, args, context) {
        checkAuth(context);

        const movieList = await db.MovieList.findByPk(args.movieListId);

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (movieList.userId !== context.user.id) {
            throw new Error('You can only remove movies from your own lists');
        }

        const entry = await db.MovieListMovie.findOne({
            where: {
                movieListId: args.movieListId,
                movieId: args.movieId
            }
        });

        if (!entry) {
            throw new Error('Movie not found in this list');
        }

        await entry.destroy();

        return await db.MovieList.findByPk(args.movieListId, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = RemoveMovieFromMovieList;

