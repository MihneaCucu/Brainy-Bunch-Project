const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');

const DiaryPayload = new GraphQLObjectType({
    name: 'Diary',
    fields: () => {
         const UserPayload = require('./UserPayload');
         const MoviePayload = require('./MoviePayload');
         return {
            id: {
                type: GraphQLID,
            },
            watchDate: {
                type: GraphQLString,
            },
            user: {
                type: UserPayload,
                resolve: (parent, args, context) => {
                    return context.db.User.findByPk(parent.userId);
                }
            },
            comments: {
                type: new GraphQLList(MoviePayload),
                resolve: (parent, args, context) => {
                    return context.db.Movie.findAll({
                        where: { diaryId: parent.id }
                    });
                }
            }
         }
    }
});