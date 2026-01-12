const { setupTestDB, db } = require('../helper');
const MovieQuery = require('../../graphql/queries/movie/movie');

setupTestDB();

describe('Query: Movie (Single)', () => {
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
    });

    it('should return the movie if it exists', async () => {
        const movie = await db.Movie.create({ title: 'Test', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        const res = await MovieQuery.resolve(null, { title: movie.title }, context);
        expect(res).toBeDefined();
        expect(res.title).toBe('Test');
    });

    it('should FAIL when movie not found', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };
        await expect(MovieQuery.resolve(null, { id: 9999 }, context)).rejects.toThrow();
    });
});
