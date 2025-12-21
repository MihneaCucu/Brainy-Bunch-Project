const { GraphQLInputObjectType, GraphQLString, GraphQLBoolean } = require('graphql');

const CreateMovieListInput = new GraphQLInputObjectType({
    name: 'CreateMovieListInput',
    fields: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean }
    }
});

module.exports = CreateMovieListInput;

