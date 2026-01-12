const { GraphQLList, GraphQLInt, GraphQLString } = require('graphql');
const MoviePayload = require('../../types/MoviePayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');


const Movies = {
    type: new GraphQLList(MoviePayload),
    args: {
        title: { type: GraphQLString },
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt }
    },
    resolve: async (_, args, context) => {
        checkAuth(context);

        const page = args.page || 1;
        const limit = Math.min(args.limit || 5, 5);
        const offset = (page - 1) * limit;

        const where = {};
        if (args.title) {
            where.title = { [db.Sequelize.Op.like]: `%${args.title}%` };
        }

        return await db.Movie.findAll({
            where,
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
            ],
            limit,
            offset
        });
    }
}

module.exports = Movies;