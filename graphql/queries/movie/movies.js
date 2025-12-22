const { GraphQLList } = require('graphql');
const MoviePayload = require('../../types/MoviePayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');


const Movies = {
    type: new GraphQLList(MoviePayload),
    resolve: async (_, args, context) => {
        checkAuth(context);

        return await db.Movie.findAll({
            include: [
                { model: db.Director, as: 'director' },
                {
                    model: db.Review,
                    as: 'reviews',
                    include: [
                        { model: db.User, as: 'user' },
                        { model: db.Comment, as: 'comments' }
                    ]
                }
            ]
        });
    }
}

module.exports = Movies;