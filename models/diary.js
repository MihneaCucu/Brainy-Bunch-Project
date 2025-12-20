'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Diary extends Model{
        static associate(models){
            Diary.belongsTo(models.User,{
                foreignKey: 'userId',
                as: 'user',
            });

            Diary.belongsToMany(models.Movie, {
                through: models.MovieDiary,
                foreignKey: 'diaryId',
                otherKey: 'movieId',
                as: 'movies',
            });
        }
    }

    Diary.init({
        userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        watchDate: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    }, {
        sequelize,
        modelName: 'Diary',
    });

    return Diary;
};