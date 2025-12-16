const graphql = require('graphql');
const { GraphQLList, GraphQLInt } = graphql;
const MovieListType = require('../types/MovieListType');
const db = require('../../models');

const getAllMovieListsQuery = {
    type: new GraphQLList(MovieListType),
    args: {
        userId: { type: GraphQLInt },
    },
    async resolve(parent, args, context) {
        const where = {};

        if (args.userId) {
            where.userId = args.userId;

            if (!context.user || context.user.id !== args.userId) {
                where.isPublic = true;
            }
        } else {
            where.isPublic = true;
        }

        return await db.MovieList.findAll({
            where,
            include: [
                { model: db.Movie, as: 'movies' },
                { model: db.User, as: 'user' }
            ],
            order: [['createdAt', 'DESC']],
        });
    }
};

module.exports = getAllMovieListsQuery;

