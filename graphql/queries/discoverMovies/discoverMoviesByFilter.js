const {  GraphQLInt, GraphQLList, GraphQLString } = require('graphql');
const MoviePayload = require('../../types/MoviePayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const DiscoverMoviesByFilter = {
    type: new GraphQLList(MoviePayload),
    args: {
        genreId: {
            type: GraphQLInt,
        },
        actorId:{
            type: GraphQLInt,
        },
        year: {
            type: GraphQLInt,
        },
        limit: {
            type: GraphQLInt,
        },
        page: {
            type: GraphQLInt,
        }
    },
    resolve: async (_, args, context, info) => {
        const where = {}
        const include = []

        const limit = args.limit || 5;
        const page = args.page || 1;
        const offset = (page - 1) * limit;

        if (args.genreId) {
            include.push({
                model: db.Genre,
                as: 'genres',
                where: {id: args.genreId},
            });
        }

        if(args.actorId) {
            include.push({
                model:db.Actor,
                as: 'actors',
                where: {id: args.actorId},
            })
        }

        if (args.year) {
            where.releaseYear = args.year;
        }

        return await db.Movie.findAll({
            where: where,
            include: include,
            order: [['releaseYear', 'DESC']],
            limit: limit,
            offset: offset,
        })
    }
}

module.exports = DiscoverMoviesByFilter;