const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const RemoveMovieFromWatchList = {
    type: WatchListPayload,
    args: {
        watchListId: { type: new GraphQLNonNull(GraphQLInt) },
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
    },

    resolve: async (parent, args, context) => {
        checkAuth(context);

        const watchList = await db.Watchlist.findByPk(args.watchListId);

        if (!watchList) {
            throw new Error('Watch list not found');
        }

        if (watchList.userId !== user.id) {
            throw new Error('You can only update your own watch lists');
        }

        const existingEntry = await db.WatchlistMovie.findOne({
            where: {
                watchlistId: args.watchListId,
                movieId: args.movieId
            }
        });

        if (!existingEntry) {
            throw new Error('Movie not found in this list');
        }

        await existingEntry.destroy();

        return await db.Watchlist.findByPk(args.watchListId, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};
module.exports = RemoveMovieFromWatchList;