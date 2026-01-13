const {
    GraphQLObjectType,
} = require('graphql');

const Comment    = require('../queries/comment/comment');
const Comments   = require('../queries/comment/comments');

const Director   = require('../queries/director/director');
const Directors  = require('../queries/director/directors');

const Genre      = require("../queries/genre/genre");
const Genres     = require('../queries/genre/genres');

const Movie      = require('../queries/movie/movie');
const Movies     = require('../queries/movie/movies');

const MovieList  = require('../queries/movieList/movieList');
const MovieLists = require('../queries/movieList/movieLists');

const MyDiary    = require('../queries/diary/myDiary');
const Diary      = require('../queries/diary/diary');
const Diaries    = require('../queries/diary/diaries');

const Review     = require('../queries/review/review');
const Reviews    = require('../queries/review/reviews');

const User       = require('../queries/user/user');
const Users      = require('../queries/user/users');

const Actor     = require('../queries/actor/actor');
const Actors     = require('../queries/actor/actors');

const WatchList = require('../queries/watchList/watchList');
const WatchLists = require('../queries/watchList/watchLists');
const MyWatchList = require('../queries/watchList/myWatchList');

const DiscoverMoviesByFilter = require('../queries/discoverMovies/discoverMoviesByFilter');
const DiscoverMoviesRandom = require('../queries/discoverMovies/discoverMoviesRandom');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        comment: Comment,
        comments: Comments,
        director: Director,
        directors: Directors,
        genre: Genre,
        genres: Genres,
        movie: Movie,
        movies: Movies,
        movieList: MovieList,
        movieLists: MovieLists,
        myDiary: MyDiary,
        diary: Diary,
        diaries: Diaries,
        review: Review,
        reviews: Reviews,
        user: User,
        users: Users,
        actor:Actor,
        actors: Actors,
        watchList: WatchList,
        watchLists: WatchLists,
        myWatchList: MyWatchList,
        discoverMoviesByFilter: DiscoverMoviesByFilter,
        discoverMoviesRandom: DiscoverMoviesRandom,
    },
});

module.exports = QueryType;