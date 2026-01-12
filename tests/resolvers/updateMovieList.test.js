const { setupTestDB, db } = require('../helper');
const UpdateMovieList = require('../../graphql/mutations/movieList/updateMovieList');

setupTestDB();

describe('Mutation: updateMovieList', () => {
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
            name: 'Original List',
            description: 'Original description',
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
    it('should update movie list name', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id,
            input: {
                name: 'Updated List Name'
            }
        };

        const result = await UpdateMovieList.resolve(null, args, context);

        expect(result.name).toBe('Updated List Name');
        expect(result.description).toBe('Original description'); // unchanged
        expect(result.isPublic).toBe(false); // unchanged
    });

    it('should update movie list description', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id,
            input: {
                description: 'New description'
            }
        };

        const result = await UpdateMovieList.resolve(null, args, context);

        expect(result.description).toBe('New description');
        expect(result.name).toBe('Original List'); // unchanged
    });

    it('should update movie list isPublic status', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id,
            input: {
                isPublic: true
            }
        };

        const result = await UpdateMovieList.resolve(null, args, context);

        expect(result.isPublic).toBe(true);
    });

    it('should update multiple fields at once', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id,
            input: {
                name: 'Completely New',
                description: 'Completely new description',
                isPublic: true
            }
        };

        const result = await UpdateMovieList.resolve(null, args, context);

        expect(result.name).toBe('Completely New');
        expect(result.description).toBe('Completely new description');
        expect(result.isPublic).toBe(true);
    });

    it('should allow updating list multiple times', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // First update
        let result = await UpdateMovieList.resolve(null, {
            id: list1.id,
            input: { name: 'First Update' }
        }, context);
        expect(result.name).toBe('First Update');

        // Second update
        result = await UpdateMovieList.resolve(null, {
            id: list1.id,
            input: { description: 'Second Update' }
        }, context);
        expect(result.description).toBe('Second Update');
        expect(result.name).toBe('First Update'); // preserved

        // Third update
        result = await UpdateMovieList.resolve(null, {
            id: list1.id,
            input: { isPublic: true }
        }, context);
        expect(result.isPublic).toBe(true);
        expect(result.name).toBe('First Update'); // preserved
        expect(result.description).toBe('Second Update'); // preserved
    });

    it('should make private list public', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        expect(list1.isPublic).toBe(false);

        const args = {
            id: list1.id,
            input: {
                isPublic: true
            }
        };

        const result = await UpdateMovieList.resolve(null, args, context);

        expect(result.isPublic).toBe(true);
    });

    it('should make public list private', async () => {
        const context = {
            user: {
                id: user2.id,
                userRole: { name: 'user' }
            }
        };

        expect(list2.isPublic).toBe(true);

        const args = {
            id: list2.id,
            input: {
                isPublic: false
            }
        };

        const result = await UpdateMovieList.resolve(null, args, context);

        expect(result.isPublic).toBe(false);
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
            id: 99999,
            input: {
                name: 'Test'
            }
        };

        await expect(UpdateMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie list not found');
    });

    it('should FAIL when user tries to update another user\'s list', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to update user1's list
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: list1.id, // list1 belongs to user1
            input: {
                name: 'Hacked List'
            }
        };

        await expect(UpdateMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You can only update your own movie lists');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: list1.id,
            input: {
                name: 'Test'
            }
        };

        await expect(UpdateMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Unauthentificated: Please log in');
    });

    it('should not affect other lists when updating one', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        await UpdateMovieList.resolve(null, {
            id: list1.id,
            input: { name: 'Updated List 1' }
        }, context);

        // Verify list2 is unchanged
        const list2Still = await db.MovieList.findByPk(list2.id);
        expect(list2Still.name).toBe('User2 List');
    });
});

