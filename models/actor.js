'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    static associate(models) {
      Actor.belongsToMany(models.Movie, {
        through: models.MovieActor,
        foreignKey: 'actorId',
        otherKey: 'movieId',
        as: 'movies'
      });
    }
  }

  Actor.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'birth_date'
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    biography: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
      validate: {
        isUrl: true
      }
    }
  }, {
    sequelize,
    modelName: 'Actor',
    tableName: 'actors',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['name']
      }
    ]
  });

  return Actor;
};

