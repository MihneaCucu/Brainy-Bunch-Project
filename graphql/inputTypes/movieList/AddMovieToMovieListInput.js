const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } = require('graphql');

const AddMovieToMovieListInput = new GraphQLInputObjectType({
    name: 'AddMovieToMovieListInput',
    fields: {
        movieListId: { type: new GraphQLNonNull(GraphQLInt) },
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
        note: { type: GraphQLString },
    }
});

module.exports = AddMovieToMovieListInput;

