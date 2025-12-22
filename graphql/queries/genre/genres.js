const { GraphQLList } = require('graphql');
const GenrePayload = require('../../types/GenrePayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const Genres = {
    type: new GraphQLList(GenrePayload),
    resolve: async (_, args, context) => {
        checkAuth(context);

        return await db.Genre.findAll();
    }
};

module.exports = Genres;