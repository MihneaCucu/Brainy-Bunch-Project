const {
    GraphQLObjectType,
} = require('graphql');
const genreQuery = require("../queries/genreQuery");
const GetAllUsersQuery = require('../queries/GetAllUsersQuery');
const movieQuery = require('../queries/movieQuery');
const GetAllMoviesQuery = require('../queries/getAllMoviesQuery');
const directorQuery = require('../queries/directorQuery');
const GetAllDirectorsQuery = require('../queries/GetAllDirectorsQuery');
const movieListQuery = require('../queries/movieListQuery');
const getAllMovieListsQuery = require('../queries/getAllMovieListsQuery');
const getMyMovieListsQuery = require('../queries/getMyMovieListsQuery');


const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        genre: genreQuery,
        getUsers: GetAllUsersQuery,
        movie: movieQuery,
        getAllMovies: GetAllMoviesQuery,
        director: directorQuery,
        getAllDirectors: GetAllDirectorsQuery,
        movieList: movieListQuery,
        getAllMovieLists: getAllMovieListsQuery,
        getMyMovieLists: getMyMovieListsQuery,
    },
});

module.exports = QueryType;