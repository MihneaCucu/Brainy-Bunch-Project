const { setupTestDB, db } = require('../helper');
const CreateMovie = require('../../graphql/mutations/movie/createMovie');

setupTestDB();

describe('Mutation: createMovie', () => {
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
    });

    it('should create movie when admin', async () => {
        const args = { title: 'Test', releaseYear: 2025 };
        const context = { user: { id: 1, userRole: { name: 'admin' } } };

        const res = await CreateMovie.resolve(null, args, context);
    
        expect(res).toBeDefined();
        expect(res.title).toBe('Test');     // `title` is unique
    });

    it('should FAIL to create movie when not admin', async () => {
        const args = { title: 'Test', releaseYear: 2025 };
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        await expect(CreateMovie.resolve(null, args, context)).rejects.toThrow();
    });

    it('should FAIL when duplicate title', async () => {
        const args = { title: 'Test', releaseYear: 2025 };
        const context = { user: { id: 1, userRole: { name: 'admin' } } };

        // create first time
        await CreateMovie.resolve(null, args, context);

        // second creation with same title should fail (unique constraint)
        await expect(CreateMovie.resolve(null, args, context)).rejects.toThrow();
    });


});
