const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const ActorPayload =  new GraphQLObjectType({
    name: 'Actor',
    fields: () => {
        const MoviePayload = require(`./MoviePayload`);
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
                resolve:async (parent) => {
                    if (parent.getMovies){
                        return await parent.getMovies();
                    }
                    return  parent.movies || [];
                }
            },
            createdAt: {
                type: GraphQLString,
                resolve: (parent) => new Date(parent.createdAt).toISOString(),
            },
            updatedAt: {
                type: GraphQLString,
                resolve: (parent) => new Date(parent.updatedAt).toISOString(),
            }
        }
    }
});
module.exports = ActorPayload;