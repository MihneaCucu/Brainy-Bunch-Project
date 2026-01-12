const { GraphQLInputObjectType, GraphQLString} = require('graphql');
const {GraphQLNonNull} = require("graphql/index");

const UpdateActorInput = new GraphQLInputObjectType({
    name: 'UpdateActorInput',
    fields: {
        name: {type: GraphQLString},
        birthDate: {type: GraphQLString},
        nationality: {type:GraphQLString},
    }
})

module.exports = UpdateActorInput;