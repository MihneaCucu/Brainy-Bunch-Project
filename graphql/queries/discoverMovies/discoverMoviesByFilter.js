const { GraphQLInt, GraphQLList, GraphQLString } = require('graphql');
const MoviePayload = require('../../types/MoviePayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');
const { Op } = require('sequelize'); 

const DiscoverMoviesByFilter = {
    type: new GraphQLList(MoviePayload),
    args: {
        genre: {
            type: GraphQLString,
        },
        actor: {
            type: GraphQLString,
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
        checkAuth(context);
        
        const where = {}
        const include = []

        const limit = args.limit || 5;
        const page = args.page || 1;
        const offset = (page - 1) * limit;

        if (args.genre) {
            include.push({
                model: db.Genre,
                as: 'genres',
                where: { 
                    name: { [Op.like]: `%${args.genre}%` }
                }, 
                required: true, // only get movies that HAVE this genre
            });
        }

        if (args.actor) {
            include.push({
                model: db.Actor,
                as: 'actors',
                where: { 
                    name: { [Op.like]: `%${args.actor}%` }
                },
                required: true, // only get movies that feature this actor
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