const graphql = require('graphql');
const { GraphQLString, GraphQLBoolean, GraphQLNonNull } = graphql;
const MovieListPayload = require('../../types/MovieListPayload');
const CreateMovieListInput = require("../../inputTypes/movieList/CreateMovieListInput");
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const createMovieList = {
    type: MovieListPayload,
    args: {
        input: {type: new GraphQLNonNull(CreateMovieListInput), }
    },
    async resolve(parent, args, context) {
        checkAuth(context);
        const input = args.input;

        return await db.MovieList.create({
            userId: context.user.id,
            name: input.name,
            description: input.description,
            isPublic: input.isPublic !== undefined ? input.isPublic : false,
        });
    }
};

module.exports = createMovieList;

