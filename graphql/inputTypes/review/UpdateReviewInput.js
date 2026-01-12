const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const UpdateReviewInput = new GraphQLInputObjectType({
    name: 'UpdateReviewInput',
    fields: {
        score: { type: GraphQLInt },
        content: { type: GraphQLString }
    }
});

module.exports = UpdateReviewInput;

