const { GraphQLString, GraphQLError, GraphQLNonNull } = require('graphql');
const DirectorPayload = require('../../types/DirectorPayload');
const CreateDirectorInput = require('../../inputTypes/director/CreateDirectorInput');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const Director = {
    type: DirectorPayload,
    args: {
        input: {
            type: new GraphQLNonNull(CreateDirectorInput),
        },
    },
    resolve: async (_, args, context) => {
        checkAuth(context);
        
        const name = args.input.name;

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

