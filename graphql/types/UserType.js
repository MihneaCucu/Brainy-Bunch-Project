const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type:GraphQLInt},
        username: {type:GraphQLString},
        email: { type: GraphQLString },
        role: { 
            type: GraphQLString,
            resolve: (user) => user.userRole ? user.userRole.name : null
        }
    })
});

module.exports = UserType;