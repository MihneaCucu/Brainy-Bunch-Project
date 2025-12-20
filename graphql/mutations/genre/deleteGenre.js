const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const DeleteGenre = {
    type: GraphQLString,    // Returns a success message
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)}
    },
    resolve: async (_, args, context) => {
        checkRole(context, ['admin']);

        const genreToDelete = await db.Genre.findByPk(args.id);

        if(!genreToDelete){
            throw new Error("Genre not found");
        }


        await genreToDelete.destroy()

        return "Genre deleted successfully";
    }
};

module.exports = DeleteGenre;
