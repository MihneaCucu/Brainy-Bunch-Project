'use strict';
const {
  Model
} = require('sequelize');
const diary = require('./diary');
module.exports = (sequelize, DataTypes) => {
    class MovieDiary extends Model{
        static associate(models){
            MovieDiary.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'movie' });
            MovieDiary.belongsTo(models.Diary, { foreignKey: 'diaryId', as: 'diary' });
        }
    }

    MovieDiary.init({
        movieId:{
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
        diaryId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Diaries',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        sequelize,
        modelName: 'MovieDiary',
        timestamps: false 
    });

    return MovieDiary;
};