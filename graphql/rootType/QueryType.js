const {
    GraphQLObjectType,
} = require('graphql');
const genreQuery = require("../queries/genreQuery");
const GetAllUsersQuery = require('../queries/GetAllUsersQuery');
const GetUserByIdQuery = require('../queries/GetUserByIdQuery');
const GetAllGenresQuery = require('../queries/GetAllGenresQuery');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        getUsers: GetAllUsersQuery,
        getUser: GetUserByIdQuery,
        getGenre: genreQuery,
        getGenres: GetAllGenresQuery,

    },
});

module.exports = QueryType;