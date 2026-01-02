const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const UpdateWatchListInput = require('../../inputTypes/watchlist/UpdateWatchListInput');
const db = require('../../../models');

const UpdateWatchList = {
    type: WatchListPayload,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        input: { type: new GraphQLNonNull(UpdateWatchListInput) },
    },
    resolve: async (parent, args, context) => {
        const user = context.user;

        if (!user) {
            throw new Error('You must be logged in to update a watch list');
        }

        const watchList = await db.Watchlist.findByPk(args.id);

        if (!watchList) {
            throw new Error('Watch list not found');
        }

        if (watchList.userId !== user.id) {
            throw new Error('You can only update your own watch lists');
        }

        const {input} = args;

        if (input.name) {
            watchList.name = input.name;
        }

        if (input.description) {
            watchList.description = input.description;
        }

        await watchList.save();

        return watchList;

    }
};

module.exports = UpdateWatchList;