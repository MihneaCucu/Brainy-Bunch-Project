const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const MoviePayload = new GraphQLObjectType({
    name: 'Movie',
    fields: () => {
        const DirectorPayload = require('./DirectorPayload');
        const ReviewPayload = require('./ReviewPayload');
        const ActorPayload = require('./ActorPayload');
        const GenrePayload = require('./GenrePayload');
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
                resolve: (parent) => {
                    return parent.getDirector() || null;
                }
            },
            reviews: {
                type: new GraphQLList(ReviewPayload),
                resolve: (parent) => {
                    return parent.getReviews() || [];
                }
            },
            actors: {
                type: new GraphQLList(ActorPayload),
                resolve: (parent) => {
                    return parent.getActors() || [];
                }
            },
            genres: {
                type: new GraphQLList(GenrePayload),
                resolve: (parent) => {
                    return parent.getGenres() || [];
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