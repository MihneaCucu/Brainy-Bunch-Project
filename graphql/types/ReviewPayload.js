const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const ReviewPayload = new GraphQLObjectType({
    name: 'Review',
    fields: () => {
        const MoviePayload = require('./MoviePayload');
        const CommentPayload = require('./CommentPayload');
        const UserPayload = require('./UserPayload')
        return {
            id: {
                type: GraphQLInt,
            },
            score: {
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
            movie: {
                type: MoviePayload,
                resolve: (parent) => {
                    return parent.getMovie() || null;
                }
            },
            user: {
                type: UserPayload,
                resolve: (parent) => {
                    return parent.getUser() || null;
                }
            },
            comments: {
                type: new GraphQLList(CommentPayload),
                resolve: (parent) => {
                    return parent.getComments() || [];
                }
            }
        };
    }
});

module.exports = ReviewPayload;
