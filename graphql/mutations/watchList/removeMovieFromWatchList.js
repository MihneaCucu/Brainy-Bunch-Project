const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const RemoveMovieFromWatchList = {
    type: WatchListPayload,
    args: {
        movieId: { type: new GraphQLNonNull(GraphQLInt) },
    },

    resolve: async (parent, args, context) => {
        checkAuth(context);

        const watchList = await db.Watchlist.findOne({
            where: {
                userId: context.user.id,
            }
        });

        if (!watchList) {
            throw new Error('Watch list not found');
        }


        const existingEntry = await db.WatchlistMovie.findOne({
            where: {
                watchlistId: watchList.id,
                movieId: args.movieId
            }
        });

        if (!existingEntry) {
            throw new Error('Movie not found in this list');
        }

        await existingEntry.destroy();

        return await db.Watchlist.findByPk(watchList.id, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};
module.exports = RemoveMovieFromWatchList;