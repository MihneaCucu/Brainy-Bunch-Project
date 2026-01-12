const graphql = require('graphql');
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const createMovieList = {
    type: MovieListPayload,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean },
    },
    async resolve(parent, args, context) {
        checkAuth(context);

        return await db.MovieList.create({
            userId: context.user.id,
            name: args.name,
            description: args.description,
            isPublic: args.isPublic !== undefined ? args.isPublic : false,
        });
    }
};

module.exports = createMovieList;

