const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const UpdateWatchListInput = new GraphQLInputObjectType({
    name: 'UpdateWatchListInput',
    fields: {
        name: {type: GraphQLString},
        description: {type: GraphQLString},
    }
});

module.exports = UpdateWatchListInput;