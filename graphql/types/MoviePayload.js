const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');

const MoviePayload = new GraphQLObjectType({
    name: 'Movie',
    fields: () => {
        const DirectorPayload = require('./DirectorPayload');
        return {
            id: {
                type: GraphQLID,
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
        };
    }
});

module.exports = MoviePayload;