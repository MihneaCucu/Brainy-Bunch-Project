const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const bcrypt = require('bcrypt');
const UserType = require('../types/UserType');
const db = require('../../models');
const { checkAuth } = require('../../utils/auth');

const ChangeUserPasswordMutation = {
    type: UserType,
    args: {
        userId: {type: new GraphQLNonNull(GraphQLInt)},
        oldPassword: { type: GraphQLString },
        newPassword: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args, context) => {
        checkAuth(context);

        const currentUserId = context.user.id;
        const currentUserRole = context.user.userRole.name;
        const targetUserId = args.userId;

        const oldPassword = args.oldPassword;
        const newPassword = args.newPassword;

        const isSelf = (currentUserId === targetUserId);
        const isAdmin = (currentUserRole === 'admin')

        if(!isSelf && !isAdmin){
            throw new Error("You are not authorized to change this password.");
        }

        const userToUpdate = await db.User.findByPk(targetUserId);
        if(!userToUpdate){
            throw new Error("User not found");
        }

        if(!isAdmin){
            if(!oldPassword){
                throw new Error("Old password is required");
            }
            const match = await bcrypt.compare(oldPassword, userToUpdate.password);
            if(!match){
                throw new Error("Password incorrect!");
            }
        }
        

        userToUpdate.password = newPassword;
        await userToUpdate.save();

        return userToUpdate.reload({include: ['userRole']});

    }

};

module.exports = ChangeUserPasswordMutation;
