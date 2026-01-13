const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const UserPayload = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type:GraphQLInt},
        username: {type:GraphQLString},
        email: { type: GraphQLString },
        role: { 
            type: GraphQLString,
            resolve: (parent) => {
                if (parent.userRole) {
                    return parent.userRole.name;
                }
            }
        }
    })
});

module.exports = UserPayload;