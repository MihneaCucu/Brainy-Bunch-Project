const {
    GraphQLObjectType,
} = require('graphql');
const genreQuery = require("../queries/genreQuery");
const GetAllUsersQuery = require('../queries/GetAllUsersQuery');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        genre: genreQuery,
        getUsers: GetAllUsersQuery,
    },
});

module.exports = QueryType;