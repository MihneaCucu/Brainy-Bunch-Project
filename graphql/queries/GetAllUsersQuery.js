const { GraphQLList } = require('graphql');
const UserType = require('../types/UserType');
const db = require('../../models');
const { checkRole } = require('../utils/auth');

const GetAllUsersQuery = {
    type: new GraphQLList(UserType),
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);      // just the admin can see all users

        return await db.User.findAll({
            include: [{model: db.Role, as:'userRole'}]
        });
    }
};
