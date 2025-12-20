'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Comments', ['userId', 'reviewId']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addIndex('Comments', ['userId', 'reviewId'], {
      unique: true,
      name: 'comments_user_id_review_id'
    });
  }
};

