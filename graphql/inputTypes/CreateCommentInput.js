const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const CreateCommentInput = new GraphQLInputObjectType({
    name: 'CreateCommentInput',
    fields: {
        reviewId: { type: new GraphQLNonNull(GraphQLInt) },
        content: { type: new GraphQLNonNull(GraphQLString) }
    }
});

module.exports = CreateCommentInput;

