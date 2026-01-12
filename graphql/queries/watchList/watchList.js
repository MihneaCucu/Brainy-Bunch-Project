const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const WatchList = {
    type: WatchListPayload,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
    },

    resolve: async (parent, args, context) => {
        checkAuth(context); // + admin

        const watchList = await db.Watchlist.findByPk(args.id, {
            include: [
                { model: db.User, as: 'user' },
                { model: db.Movie, as: 'movies' },
            ]
        });

        if (!watchList) {
            throw new Error('Watch list not found');
        }
        const currentUserRole = context.user.userRole.name;
        const isAdmin = (currentUserRole === 'admin')

        if (!context.user || context.user.id !== watchList.userId && !isAdmin) {
            throw new Error('You do not have permission to view this list');
        }

        return watchList;
    }
};

module.exports = WatchList;