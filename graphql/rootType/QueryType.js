const {
    GraphQLObjectType,
} = require('graphql');

const Director   = require('../queries/director/director');
const Directors  = require('../queries/director/directors');

const Genre      = require("../queries/genre/genre");
const Genres     = require('../queries/genre/genres');

const Movie      = require('../queries/movie/movie');
const Movies     = require('../queries/movie/movies');

const MovieList  = require('../queries/movieList/movieList');
const MovieLists = require('../queries/movieList/movieLists');

const Review     = require('../queries/review/review');
const Reviews    = require('../queries/review/reviews');

const User       = require('../queries/user/user');
const Users      = require('../queries/user/users');


const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        director: Director,
        directors: Directors,
        genre: Genre,
        genres: Genres,
        movie: Movie,
        movies: Movies,
        movieList: MovieList,
        movieLists: MovieLists,
        review: Review,
        reviews: Reviews,
        user: User,
        users: Users,
    },
});

module.exports = QueryType;