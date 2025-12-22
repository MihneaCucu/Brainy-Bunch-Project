const { GraphQLList } = require('graphql');
const DirectorType = require('../../types/DirectorPayload');
const db = require('../../../models');

const Directors = {
    type: new GraphQLList(DirectorType),
    resolve: async () => {
        checkAuth(context);
        
        return await db.Director.findAll({
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = Directors;

