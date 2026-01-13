const { setupTestDB, db } = require('../helper');
const MovieLists = require('../../graphql/queries/movieList/movieLists');

setupTestDB();

describe('Query: MovieLists list', () => {
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
    });

    describe('Happy Path', () => {
        it('should return an empty list when no movie lists exist', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            const res = await MovieLists.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res).toHaveLength(0);
        });

        it('should return a list of movie lists when data exists', async () => {
            await db.MovieList.create({
                userId: user.id,
                name: 'Top 10 Movies',
                description: 'My favorite movies',
                isPublic: true
            });

            await db.MovieList.create({
                userId: user.id,
                name: 'Watchlist 2024',
                description: 'Movies to watch in 2024',
                isPublic: true
            });

            await db.MovieList.create({
                userId: user.id,
                name: 'Classic Films',
                description: 'Classic cinema collection',
                isPublic: false
            });

            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            const res = await MovieLists.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBeGreaterThanOrEqual(1);
            expect(res[0]).toHaveProperty('name');
        });
    });

    describe('Sad Path', () => {
        it('should throw an error if the user is not authenticated', async () => {
            const context = {};

            await expect(MovieLists.resolve(null, {}, context))
                .rejects
                .toThrow();
        });
    });
});

