const { GraphQLList } = require('graphql');
const GenreType = require('../types/GenreType');
const db = require('../../models');
const { checkRole } = require('../../utils/auth');

const GetAllGenresQuery = {
    type: new GraphQLList(GenreType),
    resolve: async (_, args, context) => {
        checkRole(context);

        return await db.Genre.findAll({
            include: [{model: db.Role, as:'userRole'}]
        });
    }
};

module.exports = GetAllGenresQuery;