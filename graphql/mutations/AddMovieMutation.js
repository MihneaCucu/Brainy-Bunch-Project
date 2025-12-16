const { GraphQLString, GraphQLNonNull, GraphQLInt } = require('graphql');
const MoviePayload = require('../types/MoviePayload');
const db = require('../../models');

const AddMovieMutation = {
    type: MoviePayload,
    args: {
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        description: {
            type: GraphQLString
        },
        releaseYear: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        directorId: {
            type: GraphQLInt
        },
    },

    resolve: async (_, args) => {
        const movie = await db.Movie.create({
            title: args.title,
            description: args.description,
            releaseYear: args.releaseYear,
            directorId: args.directorId,
        });

        return await db.Movie.findByPk(movie.id, {
            include: [{ model: db.Director, as: 'director' }]
        });
    }
}

module.exports = AddMovieMutation;

