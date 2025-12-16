const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } = graphql;
const MoviePayload = require('./MoviePayload');
const UserPayload = require('./UserPayload');

const MovieListPayload = new GraphQLObjectType({
    name: 'MovieList',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean },
        userId: { type: GraphQLInt },
        user: {
            type: UserPayload,
            resolve(parent) {
                return parent.getUser();
            }
        },
        movies: {
            type: new GraphQLList(MoviePayload),
            resolve(parent) {
                return parent.getMovies();
            }
        },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    })
});

module.exports = MovieListPayload;

