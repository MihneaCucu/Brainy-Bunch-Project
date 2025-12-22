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
            unique: true,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    }, {
        sequelize,
        modelName: 'Diary',
    });

    return Diary;
};