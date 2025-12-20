const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const ReviewPayload = new GraphQLObjectType({
    name: 'Review',
    fields: () => {
        const MoviePayload = require('./MoviePayload');
        const CommentPayload = require('./CommentPayload');
        return {
            id: {
                type: GraphQLInt,
            },
            userId: {
                type: GraphQLInt,
            },
            movieId: {
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
                    return parent.movie;
                }
            },
            user: {
                type: require('./UserPayload'),
                resolve: (parent) => {
                    return parent.user;
                }
            },
            comments: {
                type: new GraphQLList(CommentPayload),
                resolve: (parent) => {
                    return parent.comments || [];
                }
            }
        };
    }
});

module.exports = ReviewPayload;
