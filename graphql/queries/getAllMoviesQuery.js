const { GraphQLList } = require('graphql');
const MovieType = require('../types/MovieType');
const db = require('../../models');

const GetAllMoviesQuery = {
    type: new GraphQLList(MovieType),
    resolve: async () => {
        return await db.Movie.findAll();
    }
}

module.exports = GetAllMoviesQuery;