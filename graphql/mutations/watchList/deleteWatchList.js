const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const DeleteWatchList = {
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context)  => {
        checkAuth(context);

        const watchList = await db.Watchlist.findByPk(args.id);

        if (!watchList) {
            throw new Error('Watch list not found');
        }

        if (watchList.userId !== context.user.id) {
            throw new Error('You can only delete your own watch lists');
        }

        await watchList.destroy();
        return  'Watch list deleted successfully';

    }
};

module.exports = DeleteWatchList;