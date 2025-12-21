const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const UpdateCommentInput = new GraphQLInputObjectType({
    name: 'UpdateCommentInput',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        content: { type: new GraphQLNonNull(GraphQLString) }
    }
});

module.exports = UpdateCommentInput;

