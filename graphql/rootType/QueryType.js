const {
    GraphQLObjectType,
} = require('graphql');
const genreQuery = require("../queries/genreQuery");
const GetAllUsersQuery = require('../queries/GetAllUsersQuery');
const movieQuery = require('../queries/movieQuery');
const GetAllMoviesQuery = require('../queries/getAllMoviesQuery');


const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        genre: genreQuery,
        getUsers: GetAllUsersQuery,
        movie: movieQuery,
        getAllMovies: GetAllMoviesQuery,
    },
});

module.exports = QueryType;