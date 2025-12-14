const { GraphQLObjectType } = require("graphql");

const loginMutation = require("../mutations/loginMutation");
const RegisterMutation = require('../mutations/registerMutation');
const UpdateUserMutation = require('../mutations/UpdateUserMutation');
const DeleteUserMutation = require('../mutations/DeleteUserMutation');
const ChangeRoleMutation = require('../mutations/ChangeRoleMutation');
const AddMovieMutation = require('../mutations/AddMovieMutation');
const DeleteMovieMutation = require('../mutations/DeleteMovieMutation');


const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: loginMutation,
        register: RegisterMutation,
        updateUser: UpdateUserMutation,
        deleteUser: DeleteUserMutation,
        changeRole: ChangeRoleMutation,
        addMovie: AddMovieMutation,
        deleteMovie: DeleteMovieMutation,
    }
});

module.exports = MutationType;