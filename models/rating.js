'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Rating.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'movie' });
    }
  }
  Rating.init({
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Rating',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'movieId']
      }
    ]
  });
  return Rating;
};