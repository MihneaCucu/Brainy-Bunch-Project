const { setupTestDB, db } = require('../helper');
const DeleteMovie = require('../../graphql/mutations/movie/deleteMovie');

setupTestDB();

/*
    TODO: Role definitions for moderator

*/

describe('Mutation: deleteMovie', () => {
    let movie;
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
        movie = await db.Movie.create({ title: 'ToDelete', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });
    });

    it('should FAIL if not admin', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        await expect(DeleteMovie.resolve(null, { id: movie.id }, context)).rejects.toThrow();
    });

    it('should delete when admin', async () => {
        const context = { user: { id: 2, userRole: { name: 'admin' } } };

        const res = await DeleteMovie.resolve(null, { id: movie.id }, context);

        expect(res).toBe('Movie deleted successfully');
    });
});
