const { setupTestDB, db } = require('../helper');
const MovieLists = require('../../graphql/queries/movieList/movieLists');

setupTestDB();

describe('Query: movieLists (List)', () => {
    let userRole, user1, user2, publicList1, publicList2, privateList1, privateList2;

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

        // Create lists
        publicList1 = await db.MovieList.create({
            userId: user1.id,
            name: 'User1 Public List 1',
            description: 'Public list',
            isPublic: true
        });

        privateList1 = await db.MovieList.create({
            userId: user1.id,
            name: 'User1 Private List',
            description: 'Private list',
            isPublic: false
        });

        publicList2 = await db.MovieList.create({
            userId: user2.id,
            name: 'User2 Public List',
            description: 'Public list from user2',
            isPublic: true
        });

        privateList2 = await db.MovieList.create({
            userId: user2.id,
            name: 'User2 Private List',
            description: 'Private list from user2',
            isPublic: false
        });
    });

    // HAPPY PATHS
    it('should return empty array when no movie lists exist', async () => {
        // Delete all lists
        await db.MovieList.destroy({ where: {} });

        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const result = await MovieLists.resolve(null, {}, context);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return only public lists when no userId specified', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const result = await MovieLists.resolve(null, {}, context);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2); // publicList1 and publicList2

        result.forEach(list => {
            expect(list.isPublic).toBe(true);
        });
    });

    it('should return all lists for specific user when owner', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            userId: user1.id
        };

        const result = await MovieLists.resolve(null, args, context);

        expect(result.length).toBe(2); // publicList1 and privateList1

        const listNames = result.map(l => l.name);
        expect(listNames).toContain('User1 Public List 1');
        expect(listNames).toContain('User1 Private List');
    });

    it('should return only public lists for specific user when not owner', async () => {
        const context = {
            user: {
                id: user1.id, // user1 viewing user2's lists
                userRole: { name: 'user' }
            }
        };

        const args = {
            userId: user2.id
        };

        const result = await MovieLists.resolve(null, args, context);

        expect(result.length).toBe(1); // only publicList2
        expect(result[0].name).toBe('User2 Public List');
        expect(result[0].isPublic).toBe(true);
    });

    it('should include user and movies in results', async () => {
        // Create movie and add to list
        const movie = await db.Movie.create({
            title: 'Test Movie',
            releaseYear: 2024,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await db.MovieListMovie.create({
            movieListId: publicList1.id,
            movieId: movie.id,
            addedAt: new Date()
        });

        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const result = await MovieLists.resolve(null, {}, context);

        const listWithMovie = result.find(l => l.id === publicList1.id);
        expect(listWithMovie).toBeDefined();
        expect(listWithMovie.user).toBeDefined();
        expect(listWithMovie.user.username).toBe('user1');
        expect(listWithMovie.movies).toBeDefined();
        expect(listWithMovie.movies.length).toBe(1);
        expect(listWithMovie.movies[0].title).toBe('Test Movie');
    });

    it('should return lists ordered by createdAt DESC', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const result = await MovieLists.resolve(null, {}, context);

        // Should be in descending order (newest first)
        for (let i = 0; i < result.length - 1; i++) {
            const current = new Date(result[i].createdAt);
            const next = new Date(result[i + 1].createdAt);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
        }
    });

    it('should paginate results with limit', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            limit: 1
        };

        const result = await MovieLists.resolve(null, args, context);

        expect(result.length).toBe(1);
    });

    it('should paginate results with page and limit', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Get first page
        const page1 = await MovieLists.resolve(null, {
            page: 1,
            limit: 1
        }, context);

        // Get second page
        const page2 = await MovieLists.resolve(null, {
            page: 2,
            limit: 1
        }, context);

        expect(page1.length).toBe(1);
        expect(page2.length).toBe(1);
        expect(page1[0].id).not.toBe(page2[0].id);
    });

    // SAD PATHS
    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        await expect(MovieLists.resolve(null, {}, context))
            .rejects
            .toThrow();
    });
});

