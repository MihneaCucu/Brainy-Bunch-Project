const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');

const ActorPayload =  new GraphQLObjectType({
    name: 'Actor',
    fields: {
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
        createdAt: {
            type: GraphQLString,
            resolve: (parent) => new Date(parent.createdAt).toISOString(),
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (parent) => new Date(parent.updatedAt).toISOString(),
        }
    }

});
module.exports = ActorPayload;