const { GraphQLInputObjectType, GraphQLString, GraphQLInt } = require('graphql');

const ReviewInput = new GraphQLInputObjectType({
    name: 'ReviewInput',
    fields: {
        score: { type: GraphQLInt },
        content: { type: GraphQLString }
    }
});

module.exports = ReviewInput;
