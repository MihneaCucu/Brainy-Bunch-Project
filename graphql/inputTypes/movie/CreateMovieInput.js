const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const CreateMovieInput = new GraphQLInputObjectType({
    name: 'CreateMovieInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        releaseYear: { type: new GraphQLNonNull(GraphQLInt) },
        directorId: { type: GraphQLInt }
    }
});

module.exports = CreateMovieInput;

