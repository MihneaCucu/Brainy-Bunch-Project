const graphql = require('graphql');
const { GraphQLList } = graphql;
const MovieListPayload = require('../types/MovieListPayload');
const db = require('../../models');

const getMyMovieListsQuery = {
    type: new GraphQLList(MovieListPayload),
    async resolve(parent, args, context) {
        if (!context.user) {
            throw new Error('You must be logged in to view your movie lists');
        }

        return await db.MovieList.findAll({
            where: { userId: context.user.id },
            include: [
                { model: db.Movie, as: 'movies' },
            ],
            order: [['createdAt', 'DESC']],
        });
    }
};

module.exports = getMyMovieListsQuery;

