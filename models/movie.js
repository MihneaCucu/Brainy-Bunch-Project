'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {

      Movie.belongsTo(models.Director, {
        foreignKey: 'directorId',
        as: 'director',
      });

      Movie.hasMany(models.Review, {foreignKey: 'movieId', as: 'reviews'});

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
        through: models.WatchlistMovie,
        foreignKey: 'movieId',
        otherKey: 'watchlistId',
        as: 'watchlistBy',
      });

      Movie.belongsToMany(models.MovieList, {
        through: models.MovieListMovie,
        foreignKey: 'movieId',
        otherKey: 'movieListId',
        as: 'inLists',
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
    directorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Directors',
            key: 'id',
        },
    },
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};