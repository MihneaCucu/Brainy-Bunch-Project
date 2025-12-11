'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    static associate(models) {
      Watchlist.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'
      });

      Watchlist.belongsToMany(models.Movie, {
        through: models.WatchlistMovie,
        foreignKey: 'watchlistId',
        otherKey: 'movieId',
        as: 'movies'
      });
    }
  }

  Watchlist.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_public'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default'
    }
  }, {
    sequelize,
    modelName: 'Watchlist',
    tableName: 'watchlists',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['is_public']
      },
      {
        fields: ['user_id', 'is_default']
      }
    ]
  });

  return Watchlist;
};

