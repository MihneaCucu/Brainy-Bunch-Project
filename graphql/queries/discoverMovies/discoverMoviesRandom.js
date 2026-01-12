const MoviePayload = require('../../types/MoviePayload');
const db = require('../../../models');
const {GraphQLList} = require("graphql/index");
const {GraphQLInt} = require("graphql/type");
const { checkAuth } = require('../../../utils/auth');


const discoverMoviesRandom = {
    type: new GraphQLList(MoviePayload),
    args: {
        limit:{
            type: GraphQLInt,
            description: 'Limit movies',
        }
    },
    resolve:  async (_, args, context) => {
        checkAuth(context);

        const limit = args.limit || 5;
        const movie = await db.Movie.findAll({
            order: db.sequelize.random(),
            limit: limit,
        });

        if (!movie) {
            throw new Error('No movie found');
        }
        return movie;
    }
}

module.exports = discoverMoviesRandom;

