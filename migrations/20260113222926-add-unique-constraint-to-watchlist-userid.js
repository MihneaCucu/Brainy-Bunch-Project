'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // This tells the database: "On table 'Watchlists', make the 'userId' column unique"
    await queryInterface.addConstraint('Watchlists', {
      fields: ['userId'],
      type: 'unique',
      name: 'custom_unique_watchlist_userId' // We give it a name so we can remove it later if needed
    });
  },

  async down (queryInterface, Sequelize) {
    // This undoes the change if you run db:migrate:undo
    await queryInterface.removeConstraint('Watchlists', 'custom_unique_watchlist_userId');
  }
};