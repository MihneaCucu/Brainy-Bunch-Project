const {
    GraphQLObjectType,
} = require('graphql');
const genreQuery = require("../queries/genreQuery");

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        genre: genreQuery,
    },
});

module.exports = QueryType;