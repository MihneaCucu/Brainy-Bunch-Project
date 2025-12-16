const { GraphQLList } = require('graphql');
const UserPayload = require('../types/UserPayload');
const db = require('../../models');
const { checkRole } = require('../../utils/auth');

const GetAllUsersQuery = {
    type: new GraphQLList(UserPayload),
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);      // just the admin can see all users

        return await db.User.findAll({
            include: [{model: db.Role, as:'userRole'}]
        });
    }
};

module.exports = GetAllUsersQuery;