const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const UpdateCommentInput = new GraphQLInputObjectType({
    name: 'UpdateCommentInput',
    fields: {
        content: { type: new GraphQLNonNull(GraphQLString) }
    }
});

module.exports = UpdateCommentInput;

