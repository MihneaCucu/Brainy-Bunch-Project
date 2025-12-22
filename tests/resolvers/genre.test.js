const { setupTestDB, db } = require('../helper');

const Genre = require('../../graphql/queries/genre/genre');

setupTestDB();

describe('Query: Genre (Single)', () => {
  let genre;

  beforeEach(async () => {
    await db.Genre.destroy({ where: {}, truncate: true });
    genre = await db.Genre.create({ name: 'Horror' });
  });

  it('should return a genre when exists', async () => {
    const context = { user: { id: 1, userRole: { name: 'user' } } };

    const res = await Genre.resolve(null, { id: genre.id }, context);

    expect(res).toBeDefined();
    expect(res.id).toBe(genre.id);
    expect(res.name).toBe('Horror');
  });

  it('should throw when genre not found', async () => {
    const context = { user: { id: 1, userRole: { name: 'user' } } };
    
    await expect(Genre.resolve(null, { id: 99999 }, context)).rejects.toThrow();
  });
});
