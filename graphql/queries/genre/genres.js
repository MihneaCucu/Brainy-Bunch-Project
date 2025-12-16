const { GraphQLList } = require('graphql');
const GenrePayload = require('../../types/GenrePayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const Genres = {
    type: new GraphQLList(GenrePayload),
    resolve: async (_, args, context) => {
        checkRole(context);

        return await db.Genre.findAll({
            include: [{model: db.Role, as:'userRole'}]
        });
    }
};

module.exports = Genres;