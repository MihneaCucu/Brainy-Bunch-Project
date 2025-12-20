const {GraphQLString, GraphQLNonNull} = require('graphql');
const db = require('../../../models');
const {checkRole} = require('../../../utils/auth');

const DeleteReview = {
    type: GraphQLString,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['user', 'moderator', 'admin']);

        const reviewToDelete = await db.Review.findByPk(args.id);

        if(!reviewToDelete){
            throw new Error("Review not found");
        }

        if(reviewToDelete.userId !== context.user.id && !['moderator', 'admin'].includes(context.user.role)){
            throw new Error("Not authorized to delete this review");
        }

        await reviewToDelete.destroy();

        return "Review deleted successfully";
    }
};

module.exports = DeleteReview;