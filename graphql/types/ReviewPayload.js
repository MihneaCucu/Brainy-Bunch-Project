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
                resolve: (parent, args, context) => {
                    return context.db.Movie.findByPk(parent.movieId);
                }
            },
            user: {
                type: require('./UserPayload'),
                resolve: (parent, args, context) => {
                    return context.db.User.findByPk(parent.userId);
                }
            },
            comments: {
                type: new GraphQLList(CommentPayload),
                resolve: (parent, args, context) => {
                    return context.db.Comment.findAll({
                        where: { reviewId: parent.id }
                    });
                }
            }
        };
    }
});

module.exports = ReviewPayload;
