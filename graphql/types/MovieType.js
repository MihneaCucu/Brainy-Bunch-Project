const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => {
        const DirectorType = require('./DirectorType');
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
                type: DirectorType,
            },
        };
    }
});

module.exports = MovieType;