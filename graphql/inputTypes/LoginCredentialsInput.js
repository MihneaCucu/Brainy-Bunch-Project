const { GraphQLInputObjectType, GraphQLString } = require("graphql");

const LoginCredentialsInput = new GraphQLInputObjectType({
    name: 'LoginCredentialsInput',
    fields: {
        username: {
            type: GraphQLString,
        },
        password: {
            type: GraphQLString
        },
    }
})

module.exports = LoginCredentialsInput;