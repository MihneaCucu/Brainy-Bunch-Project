'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WatchlistMovie extends Model {
    static associate(models) {
      WatchlistMovie.belongsTo(models.Watchlist, {foreignKey: 'watchlistId', as: 'watchlist'});
      WatchlistMovie.belongsTo(models.Movie, {foreignKey: 'movieId', as: 'movie'});
    }
  }
  WatchlistMovie.init({
    watchlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    addedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'WatchlistMovie',
  });
  return WatchlistMovie;
};



