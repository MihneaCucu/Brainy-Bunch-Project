const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const db = require('../../../models');

const MovieList = {
    type: MovieListPayload,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt }
    },
    async resolve(parent, args, context) {
        checkAuth(context);
        
        const page = args.page || 1;
        const limit = Math.min(args.limit || 5, 5);
        const offset = (page - 1) * limit;

        const movieList = await db.MovieList.findByPk(args.id, {
            include: [
                { model: db.User, as: 'user' }
            ]
        });

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (!movieList.isPublic && (!context.user || context.user.id !== movieList.userId)) {
            throw new Error('You do not have permission to view this list');
        }

        const movieListMovies = await db.MovieListMovie.findAll({
            where: { movieListId: args.id },
            attributes: ['movieId', 'addedAt'],
            order: [['addedAt', 'ASC']],
            limit,
            offset,
            raw: true
        });

        const movieIds = movieListMovies.map(mlm => mlm.movieId);

        const movies = await db.Movie.findAll({
            where: { id: movieIds }
        });

        const movieMap = {};
        movies.forEach(movie => {
            movieMap[movie.id] = movie;
        });

        movieList.movies = movieListMovies.map((mlm, index) => {
            const movie = movieMap[mlm.movieId];
            if (movie) {
                return {
                    position: offset + index + 1,
                    ...movie.toJSON()
                };
            }
            return null;
        }).filter(m => m !== null);


        return movieList;
    }
};

module.exports = MovieList;
