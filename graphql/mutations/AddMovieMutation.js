const { GraphQLString, GraphQLNonNull, GraphQLInt } = require('graphql');
const MovieType = require('../types/MovieType');
const db = require('../../models');

const AddMovieMutation = {
    type: MovieType,
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

