const { GraphQLInputObjectType, GraphQLString, GraphQLInt } = require('graphql');

const UpdateDirectorInput = new GraphQLInputObjectType({
    name: 'UpdateDirectorInput',
    fields: {
        name: { type: GraphQLString },
        birthYear: { type: GraphQLInt },
        birthDate: { type: GraphQLString },
        nationality: { type: GraphQLString }
    }
});

module.exports = UpdateDirectorInput;

