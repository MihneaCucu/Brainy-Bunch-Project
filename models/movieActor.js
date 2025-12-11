'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieActor extends Model {
    static associate(models) {

      MovieActor.belongsTo(models.Movie, {foreignKey: 'movieId', as: 'movie'});
      MovieActor.belongsTo(models.Actor, {foreignKey: 'actorId', as: 'actor'});
    }
  }

  Movie.init({
    movieId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        refereceses: {
            model: 'Movies',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    actorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        refferences: {
            model: 'Actors',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'MovieActor',
    timestamps: false,
  });

  return MovieActor;
};