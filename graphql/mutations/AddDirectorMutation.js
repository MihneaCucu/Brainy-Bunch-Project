const { GraphQLString, GraphQLNonNull } = require('graphql');
const DirectorType = require('../types/DirectorType');
const db = require('../../models');
const { checkAuth } = require('../../utils/auth');

const AddDirectorMutation = {
    type: DirectorType,
    args: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        birthDate: {
            type: GraphQLString
        },
        nationality: {
            type: GraphQLString
        },
    },

    resolve: async (_, args, context) => {
        checkAuth(context);

        return await db.Director.create({
            name: args.name,
            birthDate: args.birthDate,
            nationality: args.nationality,
        });
    }
};

module.exports = AddDirectorMutation;

