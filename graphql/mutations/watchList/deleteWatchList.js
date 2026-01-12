const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const db = require('../../../models');

const DeleteWatchList = {
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context)  => {
        const user = context.user;

        if (!user) {
            throw new Error('You must be logged in to update a watch list');
        }

        const watchList = await db.Watchlist.findByPk(args.id);

        if (!watchList) {
            throw new Error('Watch list not found');
        }

        if (watchList.userId !== user.id) {
            throw new Error('You can only delete your own watch lists');
        }

        await watchList.destroy();
        return  'Watch list deleted successfully';

    }
};

module.exports = DeleteWatchList;