const { GraphQLInt } = require('graphql');
const UserPayload = require('../../types/UserPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const User = {
    type: UserPayload,
    args: {
        id: { type: GraphQLInt }
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);      // just the admin can see a user

        const id = args.id;
        return await db.User.findByPk(id, {
            include: [{model: db.Role, as: 'userRole'}]
        });
    }
};

module.exports = User;