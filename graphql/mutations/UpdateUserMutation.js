const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const UserType = require('../types/UserType');
const db = require('../../models');
const { checkAuth } = require('../utils/auth');

const UpdateUserMutation = {
    type: UserType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        // The user CAN'T update their own role (just admin)
    },
    resolve: async (_, args, context) => {
        checkAuth(context);

        const currentUserId = context.user.id;
        const currentUserRole = context.user.userRole.name;
        const targetUserId = args.id;


        // Logic for handling self update
        const isSelfUpdate = (currentUserId === targetUserId);
        const isAdmin = (currentUserRole === 'admin');

        if(!isSelfUpdate && !isAdmin){
            throw new Error("You are not authorized to edit this user.");
        }


        // Find the user
        const userToUpdate = await db.Users.findByPk(targetUserId);
        if(!userToUpdate){
            throw new Error("User not found");
        }

        // Update fields
        if (args.username) userToUpdate.username = args.username;
        if (args.email) userToUpdate.email = args.email;
        if (args.password) userToUpdate.password = args.password;
        
        /*
            `beforeUpdate` will catch this password change and hash it

            https://www.slingacademy.com/article/using-beforecreate-and-beforeupdate-hooks-in-sequelize-js/#the-%E2%80%98beforeupdate%E2%80%99-hook
        */

        await userToUpdate.save();
        return userToUpdate.reload({include: ['userRole']});

    }

};