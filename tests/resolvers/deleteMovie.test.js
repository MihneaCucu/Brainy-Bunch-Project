const { setupTestDB, db } = require('../helper');
const DeleteMovie = require('../../graphql/mutations/movie/deleteMovie');

setupTestDB();

describe('Mutation: deleteMovie', () => {
    let movie;

    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
        movie = await db.Movie.create({
            title: 'ToDelete',
            releaseYear: 2025,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    describe('Happy Path', () => {
        it('should delete movie when user is admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };

            const res = await DeleteMovie.resolve(null, { id: movie.id }, context);

            expect(res).toBe('Movie deleted successfully');

            const deletedMovie = await db.Movie.findByPk(movie.id);
            expect(deletedMovie).toBeNull();
        });
    });

    describe('Sad Path', () => {
        it('should throw an error if user is not admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            await expect(DeleteMovie.resolve(null, { id: movie.id }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error if movie does not exist', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };

            await expect(DeleteMovie.resolve(null, { id: 9999 }, context))
                .rejects
                .toThrow('Movie not found');
        });

        it('should throw an error if user is not authenticated', async () => {
            const context = {};

            await expect(DeleteMovie.resolve(null, { id: movie.id }, context))
                .rejects
                .toThrow();
        });
    });
});
