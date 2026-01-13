const { setupTestDB, db } = require('../helper');
const DeleteMovieList = require('../../graphql/mutations/movieList/deleteMovieList');

setupTestDB();

describe('Mutation: deleteMovieList', () => {
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
            name: 'To Delete',
            description: 'This will be deleted',
            isPublic: false
        });
    });

    describe('Happy Path', () => {
        it('should delete a movie list', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            const result = await DeleteMovieList.resolve(null, { id: movieList.id }, context);

            expect(result).toBe('Movie list deleted successfully');

            const deletedList = await db.MovieList.findByPk(movieList.id);
            expect(deletedList).toBeNull();
        });
    });

    describe('Sad Path', () => {
        it('should throw an error if movie list does not exist', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            await expect(DeleteMovieList.resolve(null, { id: 9999 }, context))
                .rejects
                .toThrow('Movie list not found');
        });

        it('should throw an error if user does not own the list', async () => {
            const otherUser = await db.User.create({
                username: 'other',
                email: 'other@example.com',
                password: 'Password123!',
                roleId: user.roleId
            });

            const otherList = await db.MovieList.create({
                userId: otherUser.id,
                name: 'Protected',
                description: 'Cannot delete'
            });

            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            await expect(DeleteMovieList.resolve(null, { id: otherList.id }, context))
                .rejects
                .toThrow('You can only delete your own movie lists');
        });

        it('should throw an error if user is not authenticated', async () => {
            const context = {};

            await expect(DeleteMovieList.resolve(null, { id: movieList.id }, context))
                .rejects
                .toThrow();
        });
    });
});

