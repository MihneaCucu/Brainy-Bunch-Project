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

const GetUserByIdQuery = require('../queries/GetUserByIdQuery');
const GetAllGenresQuery = require('../queries/GetAllGenresQuery');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        getUsers: GetAllUsersQuery,
        movie: movieQuery,
        getAllMovies: GetAllMoviesQuery,
        director: directorQuery,
        getAllDirectors: GetAllDirectorsQuery,
        movieList: movieListQuery,
        getAllMovieLists: getAllMovieListsQuery,
        getMyMovieLists: getMyMovieListsQuery,
        getUser: GetUserByIdQuery,
        getGenre: genreQuery,
        getGenres: GetAllGenresQuery,

    },
});

module.exports = QueryType;