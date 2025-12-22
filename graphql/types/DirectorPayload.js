const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require('graphql');

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => {
        const MoviePayload = require('./MoviePayload');
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
                type: new GraphQLList(MoviePayload),
            },
        };
    }
});

module.exports = DirectorType;

