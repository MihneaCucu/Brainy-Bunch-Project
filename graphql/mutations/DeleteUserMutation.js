const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const db = require('../../models');
const { checkRole } = require('../../utils/auth');

const DeleteUserMutation = {
    type: GraphQLString,    // Returns a success message
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)}
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const userToDelete = await db.User.findByPk(args.id);

        if(!userToDelete){
            throw new Error("User not found");
        }

        // Logic to prevent the admin from deleting themselves
        if (userToDelete.id === context.user.id) {
            throw new Error("You cannot delete your own admin account.");
        }

        await userToDelete.destroy()

        return "User deleted successfully";
    }
};

module.exports = DeleteUserMutation;
