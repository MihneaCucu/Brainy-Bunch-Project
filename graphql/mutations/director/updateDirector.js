const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const DirectorType = require('../../types/DirectorPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const UpdateDirector = {
    type: DirectorType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        birthDate: { type: GraphQLString },
        nationality: { type: GraphQLString }
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['moderator', 'admin']);

        const director = await db.Director.findByPk(args.id);

        if (!director) {
            throw new Error('Director not found');
        }

        if (args.name !== undefined && args.name !== director.name) {
            const existingDirector = await db.Director.findOne({
                where: { name: args.name }
            });

            if (existingDirector) {
                throw new Error(`A director with the name "${args.name}" already exists.`);
            }
        }

        if (args.name !== undefined) director.name = args.name;
        if (args.birthDate !== undefined) director.birthDate = args.birthDate;
        if (args.nationality !== undefined) director.nationality = args.nationality;

        await director.save();

        return await db.Director.findByPk(director.id, {
            include: [{ model: db.Movie, as: 'movies' }]
        });
    }
};

module.exports = UpdateDirector;

