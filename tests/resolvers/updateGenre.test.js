const { setupTestDB, db } = require('../helper');
const UpdateGenre = require('../../graphql/mutations/genre/updateGenre');

setupTestDB();

describe('Mutation: updateGenre', () => {
  let genre;

  beforeEach(async () => {
    await db.Genre.destroy({ where: {}, truncate: true });
    genre = await db.Genre.create({ name: 'SciFi' });
  });

  it('should update genre when admin', async () => {
    const context = { user: { id: 1, userRole: { name: 'admin' } } };
    const args = { id: genre.id, input: { name: 'Science Fiction' } };

    const res = await UpdateGenre.resolve(null, args, context);
    
    expect(res).toBeDefined();
    expect(res.name).toBe('Science Fiction');
  });
});
