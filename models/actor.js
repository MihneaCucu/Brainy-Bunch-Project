'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    static associate(models) {
      Actor.belongsToMany(models.Movie, {
        through: models.MovieActor,
        foreignKey: 'actorId',
        otherKey: 'movieId',
        as: 'movies',
      })
    }
  }
  Actor.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    modelName: 'Actor',
  });
  return Actor;
};



