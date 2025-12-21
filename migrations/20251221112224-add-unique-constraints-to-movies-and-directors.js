'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.addIndex('Directors', ['name'], {
        unique: true,
        name: 'directors_name_unique'
      });
    } catch (error) {
      console.log('Directors name constraint might already exist or there are duplicates');
    }

    try {
      await queryInterface.addIndex('Movies', ['title'], {
        unique: true,
        name: 'movies_title_unique'
      });
    } catch (error) {
      console.log('Movies title constraint might already exist or there are duplicates');
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex('Directors', 'directors_name_unique');
    } catch (error) {
      console.log('Could not remove Directors name index');
    }

    try {
      await queryInterface.removeIndex('Movies', 'movies_title_unique');
    } catch (error) {
      console.log('Could not remove Movies title index');
    }
  }
};

