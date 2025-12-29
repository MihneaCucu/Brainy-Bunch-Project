const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const CreateActorInput =  new GraphQLInputObjectType({
    name: 'CreateActorInput',
    fields: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        birthDate: {type: GraphQLString},
        nationality: {type:GraphQLString},
    }
});

module.exports = CreateActorInput;