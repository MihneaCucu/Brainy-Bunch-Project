const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const DeleteDirector = {
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const director = await db.Director.findByPk(args.id, {
            include: [{ model: db.Movie, as: 'movies' }]
        });

        if (!director) {
            throw new Error('Director not found');
        }

        if (director.movies && director.movies.length > 0) {
            throw new Error(`Cannot delete director. They have ${director.movies.length} movie(s) associated.`);
        }

        await director.destroy();

        return 'Director deleted successfully';
    }
};

module.exports = DeleteDirector;

