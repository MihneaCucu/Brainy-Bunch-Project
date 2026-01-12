const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const UpdateMovieListInput = require('../../inputTypes/movieList/UpdateMovieListInput');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const UpdateMovieList = {
    type: MovieListPayload,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        input: { type: new GraphQLNonNull(UpdateMovieListInput) },
    },
    async resolve(parent, args, context) {
        checkAuth(context);

        const movieList = await db.MovieList.findByPk(args.id);

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (movieList.userId !== context.user.id) {
            throw new Error('You can only update your own movie lists');
        }

        const { name, description, isPublic } = args.input;

        if (name !== undefined) movieList.name = name;
        if (description !== undefined) movieList.description = description;
        if (isPublic !== undefined) movieList.isPublic = isPublic;

        await movieList.save();

        return movieList;
    }
};

module.exports = UpdateMovieList;

