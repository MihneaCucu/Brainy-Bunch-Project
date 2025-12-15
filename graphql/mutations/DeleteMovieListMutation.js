const graphql = require('graphql');
const { GraphQLInt, GraphQLNonNull, GraphQLString } = graphql;
const db = require('../../models');

const DeleteMovieListMutation = {
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    async resolve(parent, args, context) {
        if (!context.user) {
            throw new Error('You must be logged in to delete a movie list');
        }

        const movieList = await db.MovieList.findByPk(args.id);

        if (!movieList) {
            throw new Error('Movie list not found');
        }

        if (movieList.userId !== context.user.id) {
            throw new Error('You can only delete your own movie lists');
        }

        await movieList.destroy();

        return 'Movie list deleted successfully';
    }
};

module.exports = DeleteMovieListMutation;

