const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const UserPayload = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type:GraphQLInt},
        username: {type:GraphQLString},
        email: { type: GraphQLString },
        role: { 
            type: GraphQLString,
            resolve: (user) => user.getUserRole ? user.getUserRole().name : null
        }
    })
});

module.exports = UserPayload;