const { GraphQLInputObjectType, GraphQLNonNull } = require('graphql');

const RemoveMovieFromMovieListInput = new GraphQLInputObjectType({
    name: 'RemoveMovieFromMovieListInput',
    fields: {
        movieListId: { type: new GraphQLNonNull(GraphQLInt) },
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
    }
});

module.exports = RemoveMovieFromMovieListInput;

