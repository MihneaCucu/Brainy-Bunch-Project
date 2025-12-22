const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const CreateDiaryInput = new GraphQLInputObjectType({
    name: 'CreateDiaryInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) }
    }
});

module.exports = CreateDiaryInput;

