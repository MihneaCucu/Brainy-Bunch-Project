const { GraphQLList } = require('graphql');
const DirectorType = require('../types/DirectorType');
const db = require('../../models');

const GetAllDirectorsQuery = {
    type: new GraphQLList(DirectorType),
    resolve: async () => {
        return await db.Director.findAll({
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = GetAllDirectorsQuery;

