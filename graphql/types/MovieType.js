const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
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
        }
    }
});
module.exports = MovieType;