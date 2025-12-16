const { GraphQLInt, GraphQLNonNull } = require('graphql');
const UserPayload = require('../types/UserPayload');
const db = require('../../models');
const { checkRole } = require('../../utils/auth');

const ChangeRoleMutation = {
    type: UserPayload,
    args: {
        userId: {type: new GraphQLNonNull(GraphQLInt)},
        newRoleId: {type: new GraphQLNonNull(GraphQLInt)}
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const user = await db.User.findByPk(args.userId);
        if(!user){
            throw new Error("User not found");
        }

        user.roleId = args.newRoleId;
        await user.save();


        return user.reload({include: ['userRole']});
    }
};

module.exports = ChangeRoleMutation;
