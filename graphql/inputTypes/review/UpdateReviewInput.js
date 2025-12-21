const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const UpdateReviewInput = new GraphQLInputObjectType({
    name: 'UpdateReviewInput',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        score: { type: GraphQLInt },
        content: { type: GraphQLString }
    }
});

module.exports = UpdateReviewInput;

