const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const RemoveMovieToMovieListInput = require("../../inputTypes/movieList/RemoveMovieFromMovieListInput");
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const RemoveMovieFromMovieList = {
    type: MovieListPayload,
    args: {
        input: {type: new GraphQLNonNull(RemoveMovieToMovieListInput)}
    },
    async resolve(_, args, context) {
        checkAuth(context);
        const input = args.input;

        const movieList = await db.MovieList.findByPk(input.movieListId);

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        const currentUserRole = context.user.userRole.name;
        const isAdmin = (currentUserRole === 'admin')

        if (movieList.userId !== context.user.id && !isAdmin) {
            throw new Error('You can only remove movies from your own lists');
        }

        const entry = await db.MovieListMovie.findOne({
            where: {
                movieListId: input.movieListId,
                movieId: input.movieId
            }
        });

        if (!entry) {
            throw new Error('Movie not found in this list');
        }

        await entry.destroy();

        return await db.MovieList.findByPk(input.movieListId, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = RemoveMovieFromMovieList;

