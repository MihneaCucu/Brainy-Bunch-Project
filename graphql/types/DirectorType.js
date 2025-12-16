const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require('graphql');

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => {
        const MovieType = require('./MovieType');
        return {
            id: {
                type: GraphQLID,
            },
            name: {
                type: GraphQLString,
            },
            birthDate: {
                type: GraphQLString,
            },
            nationality: {
                type: GraphQLString,
            },
            movies: {
                type: new GraphQLList(MovieType),
            },
        };
    }
});

module.exports = DirectorType;

