'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    static associate(models) {
      Watchlist.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});

      Watchlist.belongsToMany(models.Movie, {
        through: models.WatchlistMovie,
        foreignKey: 'watchlistId',
        otherKey: 'movieId',
        as: 'movies',
      });
    }
  }
  Watchlist.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Watchlist',
  });
  return Watchlist;
};



