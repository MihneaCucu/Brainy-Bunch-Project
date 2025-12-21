const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = require('graphql');

const CreateReviewInput = new GraphQLInputObjectType({
    name: 'CreateReviewInput',
    fields: {
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
        score: { type: new GraphQLNonNull(GraphQLInt) },
        content: { type: new GraphQLNonNull(GraphQLString) }
    }
});

module.exports = CreateReviewInput;

