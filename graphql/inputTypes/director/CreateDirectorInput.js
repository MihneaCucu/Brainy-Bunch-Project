const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const CreateDirectorInput = new GraphQLInputObjectType({
    name: 'CreateDirectorInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        birthDate: { type: GraphQLString },
        nationality: { type: GraphQLString }
    }
});

module.exports = CreateDirectorInput;

