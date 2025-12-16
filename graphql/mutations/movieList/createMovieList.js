const graphql = require('graphql');
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = graphql;
const MovieListPayload = require('../types/MovieListPayload');
const db = require('../../models');

const createMovieList = {
    type: MovieListPayload,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean },
    },
    async resolve(parent, args, context) {
        if (!context.user) {
            throw new Error('You must be logged in to create a movie list');
        }

        return await db.MovieList.create({
            userId: context.user.id,
            name: args.name,
            description: args.description,
            isPublic: args.isPublic !== undefined ? args.isPublic : false,
        });
    }
};

module.exports = createMovieList;

