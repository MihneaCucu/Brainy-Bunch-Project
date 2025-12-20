'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {

            Comment.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            Comment.belongsTo(models.Review, {
                foreignKey: 'reviewId',
                as: 'review'
            });
        }
    }

    Comment.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Comment',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'reviewId']
            }
        ]
    });
    return Comment;
};