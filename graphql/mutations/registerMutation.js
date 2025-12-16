const { GraphQLString, GraphQLNonNull } = require('graphql');
const UserPayload = require('../types/UserPayload');
const db = require('../../models');

const registerMutation = {
    type: UserPayload,
    args: {
        username: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
    },

    resolve: async (_, args) => {
        // Checking if this user exists
        const existingUser = await db.User.findOne({
            where: {email: args.email} 
        });

        if(existingUser){
            throw new Error("Email already exists");
        }


        const newUser = await db.User.create({
            username: args.username,
            email: args.email,
            password: args.password,
            roleId: 1,               // default_role = USER
        });


        /* 
            The `beforeCreate` hook will hash password before creating the user

            https://www.slingacademy.com/article/using-beforecreate-and-beforeupdate-hooks-in-sequelize-js/#the-%E2%80%98beforeupdate%E2%80%99-hook
            https://sequelize.org/docs/v6/other-topics/hooks/
        */

        return newUser.reload({include: ['userRole']});
    }
}

module.exports = registerMutation;
