const { GraphQLObjectType, GraphQLString } = require('graphql');

const FailedAuthenticationResponse = new GraphQLObjectType({
    name: 'FailedAuthentication',
    fields: {
        reason: {
            type: GraphQLString,
        }
    }
});

module.exports = FailedAuthenticationResponse;