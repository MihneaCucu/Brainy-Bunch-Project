'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      Director.hasMany(models.Movie, {
        foreignKey: 'directorId',
        as: 'movies',
      });
    }
  }
  Director.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Director',
  });
  return Director;
};

