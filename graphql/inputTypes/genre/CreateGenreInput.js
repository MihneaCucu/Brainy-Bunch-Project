const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const CreateGenreInput = new GraphQLInputObjectType({
    name: 'CreateGenreInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) }
    }
});

module.exports = CreateGenreInput;

