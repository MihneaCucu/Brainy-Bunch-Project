const graphql = require('graphql');
const { GraphQLList, GraphQLInt } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const db = require('../../../models');

const MovieLists = {
    type: new GraphQLList(MovieListPayload),
    args: {
        userId: { type: GraphQLInt },
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt }
    },
    async resolve(parent, args, context) {
        checkAuth(context);
        
        const where = {};

        if (args.userId) {
            where.userId = args.userId;

            if (!context.user || context.user.id !== args.userId) {
                where.isPublic = true;
            }
        } else {
            where.isPublic = true;
        }

        // Pagination logic
        const page = args.page || 1;
        const limit = Math.min(args.limit || 5, 5);
        const offset = (page - 1) * limit;

        return await db.MovieList.findAll({
            where,
            include: [
                { model: db.Movie, as: 'movies' },
                { model: db.User, as: 'user' }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
    }
};

module.exports = MovieLists;

