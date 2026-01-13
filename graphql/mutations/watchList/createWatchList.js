const graphql = require('graphql');
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const CreateWatchListInput = require('../../inputTypes/watchList/CreateWatchListInput');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const createWatchList = {
    type:WatchListPayload,
    args: {
       input: {
           type: new GraphQLNonNull(CreateWatchListInput),
       }
    },
    resolve: async (_, args, context) => {
        checkAuth(context);

        const watchlist = db.Watchlist.create({
            name: args.input.name,
            description: args.input.description,
            // se leaga la userul conectat
            userId: context.user.id,
        });
        return watchlist;
    }
};

module.exports = createWatchList;
