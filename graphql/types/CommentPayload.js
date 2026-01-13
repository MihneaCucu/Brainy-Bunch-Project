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
                    if(parent.getUser)
                        return parent.getUser();
                }
            },
            review: {
                type: ReviewPayload,
                resolve: (parent) => {
                    if(parent.getReview)
                        return parent.getReview();
                }
            }
        };
    }
});

module.exports = CommentPayload;