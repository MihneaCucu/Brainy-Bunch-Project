const { GraphQLInputObjectType, GraphQLString } = require('graphql');

const UpdateGenreInput = new GraphQLInputObjectType({
    name: 'UpdateGenreInput',
    fields: {
        name: { type: GraphQLString }
    }
});

module.exports = UpdateGenreInput;

