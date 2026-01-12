const { GraphQLList } = require('graphql');
const DirectorPayload = require('../../types/DirectorPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const Directors = {
    type: new GraphQLList(DirectorPayload),
    resolve: async (_, args, context) => {
        checkAuth(context);
        
        return await db.Director.findAll({
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = Directors;

