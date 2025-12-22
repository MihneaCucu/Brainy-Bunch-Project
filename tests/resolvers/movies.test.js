const { setupTestDB, db } = require('../helper');
const MoviesQuery = require('../../graphql/queries/movie/movies');

setupTestDB();

describe('Query: Movies (List)', () => {
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
    });

    it('should return an empty array when no movies', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        const res = await MoviesQuery.resolve(null, {}, context);

        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(0);
    });

    it('should list all movies', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        await db.Movie.create({ title: 'Test', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });
        
        const res = await MoviesQuery.resolve(null, {}, context);
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBeGreaterThanOrEqual(1);
    });
});
