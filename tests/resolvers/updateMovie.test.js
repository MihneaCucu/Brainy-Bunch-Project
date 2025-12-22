const { setupTestDB, db } = require('../helper');
const UpdateMovie = require('../../graphql/mutations/movie/updateMovie');

/* 
    TODO: Define moderator role
*/

setupTestDB();

describe('Mutation: updateMovie', () => {
    let movie;
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
        movie = await db.Movie.create({ title: 'Old', releaseYear: 2001, createdAt: new Date(), updatedAt: new Date() });
    });

    it('should FAIL when not admin', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        await expect(UpdateMovie.resolve(null, { id: movie.id, title: 'New' }, context)).rejects.toThrow();
    });

    it('should update when admin', async () => {
        const context = { user: { id: 2, userRole: { name: 'admin' } } };

        const res = await UpdateMovie.resolve(null, { id: movie.id, title: 'NewTitle' }, context);

        expect(res.title).toBe('NewTitle');
    });
});
