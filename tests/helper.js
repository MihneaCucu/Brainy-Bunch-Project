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
    await db.sequelize.truncate({ cascade: true });
  });
};

module.exports = { setupTestDB, db };