const { GraphQLString, GraphQLError } = require('graphql');
const DirectorPayload = require('../../types/DirectorPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const Director = {
    type: DirectorPayload,
    args: {
        name: {
            type: GraphQLString,
        },
    },
    resolve: async (_, args, context) => {
        checkAuth(context);
        
        const { name } = args;

        const director = await db.Director.findOne({
            where: { name },
            include: [{ model: db.Movie, as: 'movies' }]
        });

        if(!director) {
            throw new GraphQLError("Director not found");
        }

        return director;
    }
};

module.exports = Director;

