const { setupTestDB, db } = require('../helper');
const CreateGenre = require('../../graphql/mutations/genre/createGenre');

setupTestDB();

describe('Mutation: createGenre', () => {
  beforeEach(async () => {
    await db.Genre.destroy({ where: {}, truncate: true });
  });

  it('should create a genre when admin', async () => {
    const context = { user: { id: 1, userRole: { name: 'admin' } } };
    const args = { name: 'Comedy' };

    const res = await CreateGenre.resolve(null, args, context);
    
    expect(res).toBeDefined();
    expect(res.name).toBe('Comedy');
  });
});
