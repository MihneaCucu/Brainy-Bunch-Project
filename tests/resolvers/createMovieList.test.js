const { setupTestDB, db } = require('../helper');
const CreateMovieList = require('../../graphql/mutations/movieList/createMovieList');

setupTestDB();

describe('Mutation: createMovieList', () => {
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
        it('should create a movie list with name and description', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                name: 'My Top 10',
                description: 'My top 10 favorite movies',
                isPublic: true
            };

            const result = await CreateMovieList.resolve(null, { input }, context);

            expect(result).toBeDefined();
            expect(result.name).toBe('My Top 10');
            expect(result.description).toBe('My top 10 favorite movies');
            expect(result.isPublic).toBe(true);
            expect(result.userId).toBe(user.id);
        });

        it('should create private movie list by default', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                name: 'Private List'
            };

            const result = await CreateMovieList.resolve(null, { input }, context);

            expect(result.isPublic).toBe(false);
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when user is not authenticated', async () => {
            const context = {};
            const input = {
                name: 'Test List'
            };

            await expect(CreateMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow();
        });
    });
});

