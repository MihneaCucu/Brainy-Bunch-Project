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
    },

    resolve: async (_, args) => {
        return await db.Movie.create({
            title: args.title,
            description: args.description,
            releaseYear: args.releaseYear,
        });
    }
}

module.exports = AddMovieMutation;

