const { GraphQLObjectType } = require("graphql");

const Login                     =   require("../mutations/login");
const Register                  =   require('../mutations/register');

const UpdateUser                =   require('../mutations/user/updateUser');
const DeleteUser                =   require('../mutations/user/deleteUser');
const UpdateUserRole            =   require('../mutations/user/updateUserRole');
const UpdateUserPassword        =   require('../mutations/user/updateUserPassword')

const CreateMovie               =   require('../mutations/movie/createMovie');
const UpdateMovie               =   require('../mutations/movie/updateMovie');
const DeleteMovie               =   require('../mutations/movie/deleteMovie');

const CreateDirector            =   require('../mutations/director/createDirector');
const UpdateDirector            =   require('../mutations/director/updateDirector');
const DeleteDirector            =   require('../mutations/director/deleteDirector');

const CreateMovieList           =   require('../mutations/movieList/createMovieList');
const UpdateMovieList           =   require('../mutations/movieList/updateMovieList');
const DeleteMovieList           =   require('../mutations/movieList/deleteMovieList');
const AddMovieToMovieList       =   require('../mutations/movieList/addMovieToMovieList');
const RemoveMovieFromMovieList  =   require('../mutations/movieList/removeMovieFromMovieList');

const MarkMovieWatched          =   require('../mutations/diary/markMovieWatched');

const CreateGenre               =   require('../mutations/genre/createGenre');
const UpdateGenre               =   require('../mutations/genre/updateGenre');
const DeleteGenre               =   require('../mutations/genre/deleteGenre');

const CreateReview              =   require('../mutations/review/createReview');
const UpdateReview              =   require('../mutations/review/updateReview');
const DeleteReview              =   require('../mutations/review/deleteReview');

const CreateComment             =   require('../mutations/comment/createComment');
const UpdateComment             =   require('../mutations/comment/updateComment');
const DeleteComment             =   require('../mutations/comment/deleteComment');


const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: Login,
        register: Register,
        updateUser: UpdateUser,
        deleteUser: DeleteUser,
        updateUserRole: UpdateUserRole,
        changeUserPassword: UpdateUserPassword,

        createMovie: CreateMovie,
        updateMovie: UpdateMovie,
        deleteMovie: DeleteMovie,

        createDirector: CreateDirector,
        updateDirector: UpdateDirector,
        deleteDirector: DeleteDirector,

        createMovieList: CreateMovieList,
        updateMovieList: UpdateMovieList,
        deleteMovieList: DeleteMovieList,
        addMovieToMovieList: AddMovieToMovieList,
        removeMovieFromMovieList: RemoveMovieFromMovieList,

        markMovieWatched: MarkMovieWatched,
      
        changeUserPassword: UpdateUserPassword,
      
        createGenre: CreateGenre,
        updateGenre: UpdateGenre,
        deleteGenre: DeleteGenre,

        createReview: CreateReview,
        updateReview: UpdateReview,
        deleteReview: DeleteReview,

        createComment: CreateComment,
        updateComment: UpdateComment,
        deleteComment: DeleteComment,
    }
});

module.exports = MutationType;