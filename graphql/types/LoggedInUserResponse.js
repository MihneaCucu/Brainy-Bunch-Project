const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const LoggedInUserResponse = new GraphQLObjectType({
    name: "LoggedInUser",
    fields: {
        id: {
            type: GraphQLInt,
        },
        token: {
            type: GraphQLString,
        }
    }
});

module.exports = LoggedInUserResponse;