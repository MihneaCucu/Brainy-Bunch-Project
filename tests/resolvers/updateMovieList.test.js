const { setupTestDB, db } = require('../helper');
const UpdateMovieList = require('../../graphql/mutations/movieList/updateMovieList');

setupTestDB();

describe('Mutation: updateMovieList', () => {
    let user;
    let movieList;

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
            name: 'Original Name',
            description: 'Original description',
            isPublic: false
        });
    });

    describe('Happy Path', () => {
        it('should update movie list name and description', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                name: 'Updated Name',
                description: 'Updated description',
                isPublic: true
            };

            const result = await UpdateMovieList.resolve(null, { id: movieList.id, input }, context);

            expect(result.name).toBe('Updated Name');
            expect(result.description).toBe('Updated description');
            expect(result.isPublic).toBe(true);
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when movie list does not exist', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = { name: 'Updated Name' };

            await expect(UpdateMovieList.resolve(null, { id: 9999, input }, context))
                .rejects
                .toThrow('Movie list not found');
        });

        it('should throw an error when user does not own the list', async () => {
            const otherUser = await db.User.create({
                username: 'other',
                email: 'other@example.com',
                password: 'Password123!',
                roleId: user.roleId
            });

            const otherList = await db.MovieList.create({
                userId: otherUser.id,
                name: 'Other List',
                description: 'Not yours'
            });

            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = { name: 'Hacked' };

            await expect(UpdateMovieList.resolve(null, { id: otherList.id, input }, context))
                .rejects
                .toThrow('You can only update your own movie lists');
        });

        it('should throw an error when user is not authenticated', async () => {
            const context = {};
            const input = { name: 'Updated Name' };

            await expect(UpdateMovieList.resolve(null, { id: movieList.id, input }, context))
                .rejects
                .toThrow();
        });
    });
});

