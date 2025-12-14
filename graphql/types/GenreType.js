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
    }
});
module.exports = GenreType;
