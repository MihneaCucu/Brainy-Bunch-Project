const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const db = require('../../../models');

const MovieList = {
    type: MovieListPayload,
    args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
    async resolve(parent, args, context) {
        const movieList = await db.MovieList.findByPk(args.id, {
            include: [
                { model: db.Movie, as: 'movies' },
                { model: db.User, as: 'user' }
            ]
        });

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (!movieList.isPublic && (!context.user || context.user.id !== movieList.userId)) {
            throw new Error('You do not have permission to view this list');
        }

        return movieList;
    }
};

module.exports = MovieList;
