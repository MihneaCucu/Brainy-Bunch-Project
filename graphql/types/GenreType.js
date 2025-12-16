const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');
const GenreType = new GraphQLObjectType({
    name: 'Genre',
    fields: {
        id: {
            type: GraphQLID,
        },
        name: {
            type: GraphQLString,
        }

        // TODO: Update genre type to include createdAt and updatedAt
    }
});
module.exports = GenreType;
