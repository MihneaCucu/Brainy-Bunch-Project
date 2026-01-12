const { GraphQLString, GraphQLNonNull } = require('graphql');
const DirectorType = require('../../types/DirectorPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');
const CreateDirectorInput = require('../../inputTypes/director/CreateDirectorInput');
const CreateDirector = {
    type: DirectorType,
    args: {
        input: {
            type: new GraphQLNonNull(CreateDirectorInput),
        }
    },

    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);
        const existingDirector = await db.Director.findOne({
            where: { name: args.input.name }
        });

        if (existingDirector) {
            throw new Error(`A director with the name "${args.input.name}" already exists.`);
        }

        return await db.Director.create({
            name: args.input.name,
            birthDate: args.input.birthDate,
            nationality: args.input.nationality,
        });
    }
};

module.exports = CreateDirector;

