const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const db = require('../../models');

const MoviePayload = new GraphQLObjectType({
    name: 'Movie',
    fields: () => {
        const DirectorPayload = require('./DirectorPayload');
        const ReviewPayload = require('./ReviewPayload');
        const ActorPayload = require('./ActorPayload');
        const GenrePayload = require('./GenrePayload');
        return {
            id: {
                type: GraphQLID,
            },
            position: {
                type: GraphQLInt,
            },
            title: {
                type: GraphQLString,
            },
            description: {
                type: GraphQLString,
            },
            releaseYear: {
                type: GraphQLInt,
            },
            director: {
                type: DirectorPayload,
                resolve: async (parent) => {
                    if (parent.director) {
                        return parent.director;
                    }
                    if (parent.getDirector) {
                        return parent.getDirector();
                    }
                    if (parent.directorId) {
                        return await db.Director.findByPk(parent.directorId);
                    }
                    return null;
                }
            },
            reviews: {
                type: new GraphQLList(ReviewPayload),
                resolve: async (parent) => {
                    if (parent.reviews && Array.isArray(parent.reviews)) {
                        return parent.reviews;
                    }
                    if (parent.getReviews) {
                        return parent.getReviews();
                    }
                    if (parent.id) {
                        return await db.Review.findAll({
                            where: { movieId: parent.id },
                            include: [{ model: db.User, as: 'user' }]
                        });
                    }
                    return [];
                }
            },
            actors: {
                type: new GraphQLList(ActorPayload),
                resolve: async (parent) => {
                    if (parent.actors && Array.isArray(parent.actors)) {
                        return parent.actors;
                    }
                    if (parent.getActors) {
                        return parent.getActors();
                    }
                    if (parent.id) {
                        const movie = await db.Movie.findByPk(parent.id, {
                            include: [{ model: db.Actor, as: 'actors' }]
                        });
                        return movie ? movie.actors : [];
                    }
                    return [];
                }
            },
            genres: {
                type: new GraphQLList(GenrePayload),
                resolve: async (parent) => {
                    if (parent.genres && Array.isArray(parent.genres)) {
                        return parent.genres;
                    }
                    if (parent.getGenres) {
                        return parent.getGenres();
                    }
                    if (parent.id) {
                        const movie = await db.Movie.findByPk(parent.id, {
                            include: [{ model: db.Genre, as: 'genres' }]
                        });
                        return movie ? movie.genres : [];
                    }
                    return [];
                }
            },
            watchedAt: {
                type: GraphQLString,
                resolve: (parent) => {
                    return parent.watchedAt || null;
                }
            },
            rating: {
                type: GraphQLInt,
                resolve: (parent) => {
                    return parent.rating || null;
                }
            },
        };
    }
});

module.exports = MoviePayload;