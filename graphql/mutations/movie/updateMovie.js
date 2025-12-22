const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const MoviePayload = require('../../types/MoviePayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const UpdateMovie = {
    type: MoviePayload,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        releaseYear: { type: GraphQLInt },
        directorId: { type: GraphQLInt },
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['moderator', 'admin']);

        const movie = await db.Movie.findByPk(args.id);
        if (!movie) {
            throw new Error("Movie not found");
        }

        if (args.title !== undefined) movie.title = args.title;
        if (args.description !== undefined) movie.description = args.description;
        if (args.releaseYear !== undefined) movie.releaseYear = args.releaseYear;
        if (args.directorId !== undefined) movie.directorId = args.directorId;

        await movie.save();

        return await db.Movie.findByPk(movie.id, {
            include: [{ model: db.Director, as: 'director' }]
        });
    }
};

module.exports = UpdateMovie;


