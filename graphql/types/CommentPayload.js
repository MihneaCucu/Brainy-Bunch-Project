const { GraphQLObjectType, GraphQLString, GraphQLInt} = require('graphql');

const CommentPayload = new GraphQLObjectType({
    name: 'Comment',
    fields: () => {
        const ReviewPayload = require('./ReviewPayload');
        const UserPayload = require('./UserPayload');
        return {
            id: {
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
            user: {
                type: UserPayload,
                resolve: (parent) => {
                    return parent.user;
                }
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