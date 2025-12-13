const { GraphQLObjectType } = require("graphql");

const loginMutation = require("../mutations/loginMutation");
const RegisterMutation = require('../mutations/registerMutation');
const UpdateUserMutation = require('../mutations/UpdateUserMutation');
const DeleteUserMutation = require('../mutations/DeleteUserMutation');
const ChangeRoleMutation = require('../mutations/ChangeRoleMutation');

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: loginMutation,
        register: RegisterMutation,
        updateUser: UpdateUserMutation,
        deleteUser: DeleteUserMutation,
        changeRole: ChangeRoleMutation
    }
});

module.exports = MutationType;