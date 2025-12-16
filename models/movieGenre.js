'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MovieGenre extends Model{
      static associate(models) {
        MovieGenre.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'movie' });
        MovieGenre.belongsTo(models.Genre, { foreignKey: 'genreId', as: 'genre' });
        }
    }

    MovieGenre.init({
        movieId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Movies',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        genreId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Genres',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        sequelize,
        modelName: 'MovieGenre',
        timestamps: false
        
    });

    return MovieGenre;
}