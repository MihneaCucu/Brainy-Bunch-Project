const { GraphQLObjectType } = require("graphql");
const loginMutation = require("../mutations/loginMutation");

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: loginMutation,
    }
});

module.exports = MutationType;