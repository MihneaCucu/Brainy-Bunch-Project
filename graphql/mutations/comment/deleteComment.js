const {GraphQLString, GraphQLInt, GraphQLNonNull} = require('graphql');
const db = require('../../../models');
const {checkAuth} = require('../../../utils/auth');

const DeleteComment = {
    type: GraphQLString,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
    resolve: async (_, args, context) => {
        checkAuth(context, ['user', 'moderator', 'admin']);

        const commentToDelete = await db.Comment.findByPk(args.id);

        if(!commentToDelete){
            throw new Error("Comment not found");
        }

        if(commentToDelete.userId !== context.user.id && !['moderator', 'admin'].includes(context.user.userRole.name)){
            throw new Error("Not authorized to delete this comment");
        }

        await commentToDelete.destroy();

        return "Comment deleted successfully";
    }
};

module.exports = DeleteComment;