process.env.NODE_ENV = 'test'; // Force test environment

const db = require('../models');

// Helper to reset the DB before/after tests
const setupTestDB = () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
  
  afterEach(async () => {
    await db.User.destroy({ where: {}, truncate: true });
    await db.Role.destroy({ where: {}, truncate: true });
  });
};

module.exports = { setupTestDB, db };