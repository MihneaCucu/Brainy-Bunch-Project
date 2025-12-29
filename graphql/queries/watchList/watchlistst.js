const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const WatchListPayload = require('../../types/WatchListPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');
const {GraphQLList} = require("graphql/type");

const Watchlists = {
    type: new GraphQLList(WatchListPayload),
    args: {},
    resolve: async (parent, { id }) => {
        checkAuth(context);

        return await db.WatchList.findAll({
            where: {
                id: id,
            },
            include: [
                { model: db.Movie, as: 'movies' },
                { model: db.User, as: 'user' }
            ],
            order: [['createdAt', 'DESC']],
        });
    }
};

module.exports = Watchlists;