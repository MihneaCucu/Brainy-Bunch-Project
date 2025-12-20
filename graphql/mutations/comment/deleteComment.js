const {GraphQLString, GraphQLNonNull} = require('graphql');
const db = require('../../../models');
const {checkRole} = require('../../../utils/auth');

const DeleteComment = {
    type: GraphQLString,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['user', 'moderator', 'admin']);

        const commentToDelete = await db.Comment.findByPk(args.id);

        if(!commentToDelete){
            throw new Error("Comment not found");
        }

        if(commentToDelete.userId !== context.user.id && !['moderator', 'admin'].includes(context.user.role)){
            throw new Error("Not authorized to delete this comment");
        }

        await commentToDelete.destroy();

        return "Comment deleted successfully";
    }
};

module.exports = DeleteComment;