const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const db = require('../../models');
const { checkRole } = require('../../utils/auth');

const DeleteMovieMutation = {
    type: GraphQLString,    // Returns a success message
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)}
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const movieToDelete = await db.Movie.findByPk(args.id);

        if(!movieToDelete){
            throw new Error("Movie not found");
        }


        await movieToDelete.destroy()

        return "Movie deleted successfully";
    }
};

module.exports = DeleteMovieMutation;
