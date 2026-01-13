const { setupTestDB, db } = require('../helper');
const CreateMovie = require('../../graphql/mutations/movie/createMovie');

setupTestDB();

describe('Mutation: createMovie', () => {
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
    });

    describe('Happy Path', () => {
        it('should create movie when user is admin', async () => {
            const args = {
                input: {
                    title: 'Test Movie',
                    releaseYear: 2025
                }
            };
            const context = { user: { id: 1, userRole: { name: 'admin' } } };

            const res = await CreateMovie.resolve(null, args, context);

            expect(res).toBeDefined();
            expect(res.title).toBe('Test Movie');
            expect(res.releaseYear).toBe(2025);
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when user is not admin', async () => {
            const args = {
                input: {
                    title: 'Test Movie',
                    releaseYear: 2025
                }
            };
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            await expect(CreateMovie.resolve(null, args, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when duplicate title exists', async () => {
            const args = {
                input: {
                    title: 'Duplicate Title',
                    releaseYear: 2025
                }
            };
            const context = { user: { id: 1, userRole: { name: 'admin' } } };

            // Create first movie
            await CreateMovie.resolve(null, args, context);

            // Attempt to create second movie with same title should fail
            await expect(CreateMovie.resolve(null, args, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when user is not authenticated', async () => {
            const args = {
                input: {
                    title: 'Test Movie',
                    releaseYear: 2025
                }
            };
            const context = {};

            await expect(CreateMovie.resolve(null, args, context))
                .rejects
                .toThrow();
        });
    });
});
