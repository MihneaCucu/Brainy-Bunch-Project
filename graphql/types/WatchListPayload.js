const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const MoviePlayLoad = require('./MoviePayload.js');
const UserPayload = require('./UserPayload');
const WatchListPayload = new GraphQLObjectType({
    name: 'WatchListPayload',
    fields: {
        id:{
            type: GraphQLID,
        },
        user: {
            type: UserPayload,
            resolve(parent) {
                return parent.getUser();
            }
        },
        name: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        movies: {
            type: new GraphQLList(MoviePlayLoad),
            resolve(parent) {
                return parent.movies || (parent.getMovies ? parent.getMovies() : []);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve: (parent) => new Date(parent.createdAt).toISOString(),
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (parent) => new Date(parent.updatedAt).toISOString(),
        },
    }
});
module.exports = WatchListPayload;