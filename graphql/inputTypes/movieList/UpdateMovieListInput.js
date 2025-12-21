const { GraphQLInputObjectType, GraphQLString, GraphQLBoolean } = require('graphql');

const UpdateMovieListInput = new GraphQLInputObjectType({
    name: 'UpdateMovieListInput',
    fields: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean }
    }
});

module.exports = UpdateMovieListInput;

