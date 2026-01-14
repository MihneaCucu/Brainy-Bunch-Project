const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');
const {GraphQLList} = require("graphql/type");

const Watchlists = {
    type: new GraphQLList(WatchListPayload),
    args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt }
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const page = args.page || 1;
        const limit = Math.min(args.limit || 5, 5);
        const offset = (page - 1) * limit;

        return await db.Watchlist.findAll({
            include: [
                { model: db.Movie, as: 'movies' },
                { model: db.User, as: 'user' }
            ],
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset,
        });
    }
};

module.exports = Watchlists;