'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieListMovie extends Model {
    static associate(models) {
      MovieListMovie.belongsTo(models.MovieList, {
        foreignKey: 'movieListId',
        as: 'movieList'
      });
      MovieListMovie.belongsTo(models.Movie, {
        foreignKey: 'movieId',
        as: 'movie'
      });
    }
  }
  MovieListMovie.init({
    movieListId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'MovieLists',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    movieId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'Movies',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    addedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'MovieListMovie',
    timestamps: false,
  });
  return MovieListMovie;
};

