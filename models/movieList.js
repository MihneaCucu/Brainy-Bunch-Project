'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieList extends Model {
    static associate(models) {
      MovieList.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      MovieList.belongsToMany(models.Movie, {
        through: models.MovieListMovie,
        foreignKey: 'movieListId',
        otherKey: 'movieId',
        as: 'movies',
      });
    }
  }
  MovieList.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'MovieList',
  });
  return MovieList;
};

