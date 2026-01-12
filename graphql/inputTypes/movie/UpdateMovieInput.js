const { GraphQLInputObjectType, GraphQLString, GraphQLInt } = require('graphql');

const UpdateMovieInput = new GraphQLInputObjectType({
    name: 'UpdateMovieInput',
    fields: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        releaseYear: { type: GraphQLInt },
        directorId: { type: GraphQLInt }
    }
});

module.exports = UpdateMovieInput;

        // id: {type: new GraphQLNonNull(GraphQLInt)},
        // title: { type: GraphQLString },
        // description: { type: GraphQLString },
        // releaseYear: { type: GraphQLInt },
        // directorId: { type: GraphQLInt },