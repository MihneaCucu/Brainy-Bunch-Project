const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const DirectorType = require('../../types/DirectorPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');
const UpdateDirectorInput = require('../../inputTypes/director/UpdateDirectorInput');

const UpdateDirector = {
    type: DirectorType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        input: {
            type: new GraphQLNonNull(UpdateDirectorInput),
        }
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const director = await db.Director.findByPk(args.id);

        if (!director) {
            throw new Error('Director not found');
        }

        if (args.input.name !== undefined && args.input.name !== director.name) {
            const existingDirector = await db.Director.findOne({
                where: { name: args.input.name }
            });

            if (existingDirector) {
                throw new Error(`A director with the name "${args.input.name}" already exists.`);
            }
        }

        if (args.input.name !== undefined) director.name = args.input.name;
        if (args.input.birthDate !== undefined) director.birthDate = args.input.birthDate;
        if (args.input.nationality !== undefined) director.nationality = args.input.nationality;

        await director.save();

        return await db.Director.findByPk(director.id, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = UpdateDirector;

