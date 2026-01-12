const graphql = require('graphql');
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const CreateWatchListInput = require('../../inputTypes/watchList/CreateWatchListInput');
const db = require('../../../models');

const createWatchList = {
    type:WatchListPayload,
    args: {
       input: {
           type: new GraphQLNonNull(CreateWatchListInput),
       }
    },
    resolve: async (parent, args, context) => {
        const user = context.user;
        if (!user) {
            throw new Error('You must be logged in to create a watch list');
        }

        const watchlist = db.Watchlist.create({
            name: args.input.name,
            description: args.input.description,
            // se leaga la userul conectat
            userId: user.id,
        });
        return watchlist;
    }
};

module.exports = createWatchList;
