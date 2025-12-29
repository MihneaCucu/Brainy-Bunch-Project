const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const DeleteActor = {
    type: GraphQLString,    // Returns a success message
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)}
    },
    resolve: async (parent, args, context) => {
        checkRole(context, ['admin']);

        const actorToDelete = await db.Actor.findByPk(args.id);

        if (!actorToDelete) {
            throw new Error("Actor not found");
        }

        await actorToDelete.destroy();

        return "Genre deleted successfully";
    }
};

module.exports = DeleteActor;