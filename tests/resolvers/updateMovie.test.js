const { setupTestDB, db } = require('../helper');
const UpdateMovie = require('../../graphql/mutations/movie/updateMovie');

setupTestDB();

describe('Mutation: updateMovie', () => {
    let movie;

    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
        movie = await db.Movie.create({
            title: 'Old Title',
            releaseYear: 2001,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    describe('Happy Path', () => {
        it('should update movie when user is admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };
            const input = { title: 'New Title', releaseYear: 2025 };

            const res = await UpdateMovie.resolve(null, { id: movie.id, input }, context);

            expect(res.title).toBe('New Title');
            expect(res.releaseYear).toBe(2025);
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when user is not admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };
            const input = { title: 'New Title' };

            await expect(UpdateMovie.resolve(null, { id: movie.id, input }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when movie does not exist', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };
            const input = { title: 'New Title' };

            await expect(UpdateMovie.resolve(null, { id: 9999, input }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when user is not authenticated', async () => {
            const context = {};
            const input = { title: 'New Title' };

            await expect(UpdateMovie.resolve(null, { id: movie.id, input }, context))
                .rejects
                .toThrow();
        });
    });
});
