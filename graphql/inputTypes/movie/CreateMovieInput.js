const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } = require('graphql');

const CreateMovieInput = new GraphQLInputObjectType({
    name: 'CreateMovieInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        releaseYear: { type: new GraphQLNonNull(GraphQLInt) },
        directorId: { type: GraphQLInt },
        genreIds: { type: new GraphQLList(GraphQLInt) },
        actorIds: { type: new GraphQLList(GraphQLInt) }
    }
});

module.exports = CreateMovieInput;

