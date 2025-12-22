const { setupTestDB, db } = require('../helper');
const DeleteGenre = require('../../graphql/mutations/genre/deleteGenre');

setupTestDB();

describe('Mutation: deleteGenre', () => {
    let genre;

    beforeEach(async () => {
        await db.Genre.destroy({ where: {}, truncate: true });
        genre = await db.Genre.create({ name: 'Test' });
    });

    it('should delete genre when admin', async () => {
        const context = { user: { id: 1, userRole: { name: 'admin' } } };
        const args = { id: genre.id };

        const res = await DeleteGenre.resolve(null, args, context);
        expect(res).toBe('Genre deleted successfully');
    });
});
