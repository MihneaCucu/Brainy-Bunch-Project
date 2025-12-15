const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } = graphql;
const MovieType = require('./MovieType');
const UserType = require('./UserType');

const MovieListType = new GraphQLObjectType({
    name: 'MovieList',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        isPublic: { type: GraphQLBoolean },
        userId: { type: GraphQLInt },
        user: {
            type: UserType,
            resolve(parent) {
                return parent.getUser();
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent) {
                return parent.getMovies();
            }
        },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    })
});

module.exports = MovieListType;

