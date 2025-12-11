'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {

      Movie.hasMany(models.Review, {foreignKey: 'movieId', as: 'reviews'});
      Movie.hasMany(models.Rating, {foreignKey: 'movieId', as: 'ratings'});

      Movie.belongsToMany(models.Genre, {
        through: models.MovieGenre,
        foreignKey: 'movieId',
        otherKey: 'genreId',
        as: 'genres',
      });

      Movie.belongsToMany(models.Actor, {
        through: models.MovieActor,
        foreignKey: 'movieId',
        otherKey: 'actorId',
        as: 'actors',
      });

      Movie.belongsToMany(models.Watchlist, {
        through: models.WatchlistMovies,
        foreignKey: 'movieId',
        otherKey: 'watchlistId',
        as: 'watchlistBy',
      });
    }
  }

  Movie.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};