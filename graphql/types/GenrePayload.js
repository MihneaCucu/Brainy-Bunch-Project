const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');
const GenrePayload = new GraphQLObjectType({
    name: 'Genre',
    fields: {
        id: {
            type: GraphQLID,
        },
        name: {
            type: GraphQLString,
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
module.exports = GenrePayload;
