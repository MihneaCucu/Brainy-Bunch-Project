const { setupTestDB, db } = require('../helper');
const DeleteMovieList = require('../../graphql/mutations/movieList/deleteMovieList');

setupTestDB();

describe('Mutation: deleteMovieList', () => {
    let userRole, user1, user2, list1, list2;

    beforeEach(async () => {
        // Create role
        userRole = await db.Role.create({ name: 'user' });

        // Create users
        user1 = await db.User.create({
            username: 'user1',
            email: 'user1@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        user2 = await db.User.create({
            username: 'user2',
            email: 'user2@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        // Create movie lists
        list1 = await db.MovieList.create({
            userId: user1.id,
            name: 'User1 List',
            description: 'User1 description',
            isPublic: false
        });

        list2 = await db.MovieList.create({
            userId: user2.id,
            name: 'User2 List',
            description: 'User2 description',
            isPublic: true
        });
    });

    // HAPPY PATHS
    it('should delete own movie list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id
        };

        const result = await DeleteMovieList.resolve(null, args, context);

        expect(result).toBe('Movie list deleted successfully');

        // Verify deletion
        const deletedList = await db.MovieList.findByPk(list1.id);
        expect(deletedList).toBeNull();
    });

    it('should verify list is removed from database', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Verify list exists
        let listExists = await db.MovieList.findByPk(list1.id);
        expect(listExists).not.toBeNull();

        const args = {
            id: list1.id
        };

        await DeleteMovieList.resolve(null, args, context);

        // Verify list no longer exists
        listExists = await db.MovieList.findByPk(list1.id);
        expect(listExists).toBeNull();
    });

    it('should not affect other lists when deleting one', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id
        };

        await DeleteMovieList.resolve(null, args, context);

        // Verify list2 still exists
        const list2Still = await db.MovieList.findByPk(list2.id);
        expect(list2Still).not.toBeNull();
        expect(list2Still.name).toBe('User2 List');
    });

    it('should delete list with movies', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Create movie
        const movie = await db.Movie.create({
            title: 'Test Movie',
            releaseYear: 2024,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Add movie to list
        await db.MovieListMovie.create({
            movieListId: list1.id,
            movieId: movie.id,
            addedAt: new Date()
        });

        const args = {
            id: list1.id
        };

        const result = await DeleteMovieList.resolve(null, args, context);

        expect(result).toBe('Movie list deleted successfully');

        // Verify list is deleted
        const deletedList = await db.MovieList.findByPk(list1.id);
        expect(deletedList).toBeNull();

        // Verify movie still exists (cascade should handle MovieListMovie)
        const movieStillExists = await db.Movie.findByPk(movie.id);
        expect(movieStillExists).not.toBeNull();
    });

    it('should delete public list', async () => {
        const context = {
            user: {
                id: user2.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list2.id
        };

        const result = await DeleteMovieList.resolve(null, args, context);

        expect(result).toBe('Movie list deleted successfully');

        const deletedList = await db.MovieList.findByPk(list2.id);
        expect(deletedList).toBeNull();
    });

    // SAD PATHS
    it('should FAIL when movie list does not exist', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: 99999
        };

        await expect(DeleteMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie list not found');
    });

    it('should FAIL when user tries to delete another user\'s list', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to delete user1's list
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id // list1 belongs to user1
        };

        await expect(DeleteMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You can only delete your own movie lists');

        // Verify list still exists
        const listStillExists = await db.MovieList.findByPk(list1.id);
        expect(listStillExists).not.toBeNull();
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: list1.id
        };

        await expect(DeleteMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You must be logged in to delete a movie list');
    });

    it('should allow user to delete multiple lists', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Create another list for user1
        const list3 = await db.MovieList.create({
            userId: user1.id,
            name: 'User1 Second List',
            description: 'Another list',
            isPublic: false
        });

        // Delete first list
        await DeleteMovieList.resolve(null, { id: list1.id }, context);

        let deleted1 = await db.MovieList.findByPk(list1.id);
        expect(deleted1).toBeNull();

        // Delete second list
        await DeleteMovieList.resolve(null, { id: list3.id }, context);

        let deleted3 = await db.MovieList.findByPk(list3.id);
        expect(deleted3).toBeNull();
    });
});

