const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const MoviePayload = new GraphQLObjectType({
    name: 'Movie',
    fields: () => {
        const DirectorPayload = require('./DirectorPayload');
        const ReviewPayload = require('./ReviewPayload');
        return {
            id: {
                type: GraphQLID,
            },
            position: {
                type: GraphQLInt,
            },
            title: {
                type: GraphQLString,
            },
            description: {
                type: GraphQLString,
            },
            releaseYear: {
                type: GraphQLInt,
            },
            director: {
                type: DirectorPayload,
            },
            reviews: {
                type: new GraphQLList(ReviewPayload),
                resolve: (parent) => {
                    return parent.reviews || [];
                }
            },
            diaryReview: {
                type: ReviewPayload,
                resolve: (parent) => {
                    // DiaryPayload attaches a `review` property for diary entries
                    return parent.review || null;
                }
            },
            watchedAt: {
                type: GraphQLString,
            },
            rating: {
                type: GraphQLInt,
            },
        };
    }
});

module.exports = MoviePayload;