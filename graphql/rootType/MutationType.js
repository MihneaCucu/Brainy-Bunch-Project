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

const CreateMovieList           =   require('../mutations/movieList/createMovieList');
const UpdateMovieList           =   require('../mutations/movieList/updateMovieList');
const DeleteMovieList           =   require('../mutations/movieList/deleteMovieList');
const AddMovieToMovieList       =   require('../mutations/movieList/addMovieToMovieList');
const RemoveMovieFromMovieList  =   require('../mutations/movieList/removeMovieFromMovieList');

const CreateGenre               =   require('../mutations/genre/createGenre');
const UpdateGenre               =   require('../mutations/genre/updateGenre');
const DeleteGenre               =   require('../mutations/genre/deleteGenre');

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: Login,
        register: Register,
        updateUser: UpdateUser,
        deleteUser: DeleteUser,
        updateUserRole: UpdateUserRole,
        createMovie: CreateMovie,
        updateMovie: UpdateMovie,
        deleteMovie: DeleteMovie,
        createDirector: CreateDirector,
        createMovieList: CreateMovieList,
        updateMovieList: UpdateMovieList,
        deleteMovieList: DeleteMovieList,
        addMovieToMovieList: AddMovieToMovieList,
        removeMovieFromMovieList: RemoveMovieFromMovieList,
        changeUserPassword: UpdateUserPassword,
        createGenre: CreateGenre,
        updateGenre: UpdateGenre,
        deleteGenre: DeleteGenre,
    }
});

module.exports = MutationType;