"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // add rating column
    await queryInterface.addColumn('MovieDiaries', 'rating', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // migrate existing note content if any (optional) - skipping text->int conversion
    // remove note column
    await queryInterface.removeColumn('MovieDiaries', 'note');
  },

  async down(queryInterface, Sequelize) {
    // restore note column
    await queryInterface.addColumn('MovieDiaries', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.removeColumn('MovieDiaries', 'rating');
  }
};
