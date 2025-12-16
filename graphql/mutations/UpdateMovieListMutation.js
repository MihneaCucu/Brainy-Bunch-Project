const graphql = require('graphql');
const { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } = graphql;
const MovieListPayload = require('../types/MovieListPayload');
const db = require('../../models');

const UpdateMovieListMutation = {
    type: MovieListPayload,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean },
    },
    async resolve(parent, args, context) {
        if (!context.user) {
            throw new Error('You must be logged in to update a movie list');
        }

        const movieList = await db.MovieList.findByPk(args.id);

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (movieList.userId !== context.user.id) {
            throw new Error('You can only update your own movie lists');
        }

        if (args.name !== undefined) movieList.name = args.name;
        if (args.description !== undefined) movieList.description = args.description;
        if (args.isPublic !== undefined) movieList.isPublic = args.isPublic;

        await movieList.save();

        return movieList;
    }
};

module.exports = UpdateMovieListMutation;

