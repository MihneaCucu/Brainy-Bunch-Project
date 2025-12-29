const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } = require('graphql');

const CreateWatchListInput = new GraphQLInputObjectType({
    name: 'CreateWatchListInput',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString,
        }
    }
});
module.exports = CreateWatchListInput;