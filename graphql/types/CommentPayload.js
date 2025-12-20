const { GraphQLObjectType, GraphQLString, GraphQLInt} = require('graphql');

const CommentPayload = new GraphQLObjectType({
    name: 'Comment',
    fields: () => {
        const ReviewPayload = require('./ReviewPayload');
        return {
            id: {
                type: GraphQLInt,
            },
            userId: {
                type: GraphQLInt,
            },
            reviewId: {
                type: GraphQLInt,
            },
            content: {
                type: GraphQLString,
            },
            createdAt: {
                type: GraphQLString,
                resolve: (parent) => new Date(parent.createdAt).toISOString(),
            },
            updatedAt: {
                type: GraphQLString,
                resolve: (parent) => new Date(parent.updatedAt).toISOString(),
            },
            review: {
                type: ReviewPayload,
                resolve: (parent) => {
                    return parent.review;
                }
            }
        };
    }
});

module.exports = CommentPayload;