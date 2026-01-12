const { setupTestDB, db } = require('../helper');
const CreateMovieList = require('../../graphql/mutations/movieList/createMovieList');

setupTestDB();

describe('Mutation: createMovieList', () => {
    let userRole, user1, user2;

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
    });

    // HAPPY PATHS
    it('should create movie list with name and description', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            name: 'My Top 10',
            description: 'My top 10 favorite movies',
            isPublic: true
        };

        const result = await CreateMovieList.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.name).toBe('My Top 10');
        expect(result.description).toBe('My top 10 favorite movies');
        expect(result.isPublic).toBe(true);
        expect(result.userId).toBe(user1.id);
    });

    it('should create private movie list by default', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            name: 'Private List'
        };

        const result = await CreateMovieList.resolve(null, args, context);

        expect(result.isPublic).toBe(false);
    });

    it('should create movie list with only name', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            name: 'Simple List'
        };

        const result = await CreateMovieList.resolve(null, args, context);

        expect(result.name).toBe('Simple List');
        expect(result.description).toBeUndefined();
        expect(result.isPublic).toBe(false);
    });

    it('should allow user to create multiple lists', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const list1 = await CreateMovieList.resolve(null, {
            name: 'Action Movies'
        }, context);

        const list2 = await CreateMovieList.resolve(null, {
            name: 'Comedy Movies'
        }, context);

        expect(list1.name).toBe('Action Movies');
        expect(list2.name).toBe('Comedy Movies');
        expect(list1.id).not.toBe(list2.id);
        expect(list1.userId).toBe(user1.id);
        expect(list2.userId).toBe(user1.id);
    });

    it('should allow different users to create lists with same name', async () => {
        const context1 = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const context2 = {
            user: {
                id: user2.id,
                userRole: { name: 'user' }
            }
        };

        const list1 = await CreateMovieList.resolve(null, {
            name: 'My Favorites'
        }, context1);

        const list2 = await CreateMovieList.resolve(null, {
            name: 'My Favorites'
        }, context2);

        expect(list1.userId).toBe(user1.id);
        expect(list2.userId).toBe(user2.id);
        expect(list1.id).not.toBe(list2.id);
    });

    it('should create public movie list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            name: 'Public Top 10',
            description: 'My public list',
            isPublic: true
        };

        const result = await CreateMovieList.resolve(null, args, context);

        expect(result.isPublic).toBe(true);
    });

    it('should store movie list in database', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            name: 'Test List',
            description: 'Test description'
        };

        const result = await CreateMovieList.resolve(null, args, context);

        // Verify in database
        const listInDb = await db.MovieList.findByPk(result.id);
        expect(listInDb).not.toBeNull();
        expect(listInDb.name).toBe('Test List');
        expect(listInDb.description).toBe('Test description');
        expect(listInDb.userId).toBe(user1.id);
    });

    // SAD PATHS
    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            name: 'Test List'
        };

        await expect(CreateMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You must be logged in to create a movie list');
    });

    it('should allow creating multiple public lists', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const list1 = await CreateMovieList.resolve(null, {
            name: 'Public List 1',
            isPublic: true
        }, context);

        const list2 = await CreateMovieList.resolve(null, {
            name: 'Public List 2',
            isPublic: true
        }, context);

        expect(list1.isPublic).toBe(true);
        expect(list2.isPublic).toBe(true);
        expect(list1.id).not.toBe(list2.id);
    });
});

