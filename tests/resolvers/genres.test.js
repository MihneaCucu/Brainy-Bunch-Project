const { setupTestDB, db } = require('../helper');
const Genres = require('../../graphql/queries/genre/genres');

setupTestDB();

describe('Query: Genres (List)', () => {
  beforeEach(async () => {
    await db.Genre.destroy({ where: {}, truncate: true });
  });

  it('should return empty array when no genres exist', async () => {
    const context = { user: { id: 1, userRole: { name: 'user' } } };

    const res = await Genres.resolve(null, {}, context);

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(0);
  });

  it('should list genres', async () => {
    await db.Genre.create({ name: 'Action' });
    await db.Genre.create({ name: 'Drama' });

    const context = { user: { id: 1, userRole: { name: 'user' } } };
    const res = await Genres.resolve(null, {}, context);

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThanOrEqual(2);
  });
});
