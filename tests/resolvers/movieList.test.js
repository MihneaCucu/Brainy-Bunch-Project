const { setupTestDB, db } = require('../helper');
const MovieList = require('../../graphql/queries/movieList/movieList');

setupTestDB();

describe('Query: MovieList by id', () => {
    let movieList;
    let user;

    beforeEach(async () => {
        await db.MovieList.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });

        const role = await db.Role.create({ name: 'user' });

        user = await db.User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
            roleId: role.id
        });

        movieList = await db.MovieList.create({
            userId: user.id,
            name: 'Top 10 Movies',
            description: 'My favorite movies',
            isPublic: true
        });
    });

    describe('Happy Path', () => {
        it('should return a movie list when id exists', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            const args = { id: movieList.id };

            const res = await MovieList.resolve(null, args, context);

            expect(res).toBeDefined();
            expect(res.id).toBe(movieList.id);
            expect(res.name).toBe('Top 10 Movies');
            expect(res.description).toBe('My favorite movies');
            expect(res.isPublic).toBe(true);
        });
    });

    describe('Sad Path', () => {
        it('should throw when id not found', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            await expect(MovieList.resolve(null, { id: 9999 }, context))
                .rejects
                .toThrow();
        });
    });
});

