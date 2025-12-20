'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Create Roles
    await queryInterface.bulkInsert('Roles', [
      { id: 1, name: 'user' },
      { id: 2, name: 'moderator' },
      { id: 3, name: 'admin' }
    ], {});

    // One hashed password to use for all test users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('UserPa55!', salt);

    // Create Users
    await queryInterface.bulkInsert('Users', [
      {
        username: 'RegularUser',
        email: 'user@example.com',
        password: hashedPassword,
        roleId: 1, // 'user' role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'ModeratorUser',
        email: 'mod@example.com',
        password: hashedPassword,
        roleId: 2, // 'moderator' role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'AdminUser',
        email: 'admin@example.com',
        password: hashedPassword,
        roleId: 3, // 'admin' role
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // delete data in reverse order (Users first, then Roles) 
    // to avoid foreign key constraint errors
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};