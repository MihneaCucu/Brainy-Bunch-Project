const { GraphQLString, GraphQLNonNull } = require('graphql');
const DirectorType = require('../../types/DirectorPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const CreateDirector = {
    type: DirectorType,
    args: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        birthDate: {
            type: GraphQLString
        },
        nationality: {
            type: GraphQLString
        },
    },

    resolve: async (_, args, context) => {
        checkRole(context, ['moderator', 'admin']);
        const existingDirector = await db.Director.findOne({
            where: { name: args.name }
        });

        if (existingDirector) {
            throw new Error(`A director with the name "${args.name}" already exists.`);
        }

        return await db.Director.create({
            name: args.name,
            birthDate: args.birthDate,
            nationality: args.nationality,
        });
    }
};

module.exports = CreateDirector;

