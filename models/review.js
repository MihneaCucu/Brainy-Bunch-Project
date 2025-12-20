'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {

      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      Review.belongsTo(models.Movie, {
        foreignKey: 'movieId',
        as: 'movie'
      });

      Review.hasMany(models.Comment, {
        foreignKey: 'reviewId',
        as: 'comments'
      });
    }
  }

  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};



