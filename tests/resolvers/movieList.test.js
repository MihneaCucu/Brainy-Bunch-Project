const { setupTestDB, db } = require('../helper');
const MovieList = require('../../graphql/queries/movieList/movieList');

setupTestDB();

describe('Query: movieList (Single)', () => {
    let userRole, user1, user2, publicList, privateList, movie1, movie2, movie3;

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
        publicList = await db.MovieList.create({
            userId: user1.id,
            name: 'Public List',
            description: 'A public list',
            isPublic: true
        });

        privateList = await db.MovieList.create({
            userId: user1.id,
            name: 'Private List',
            description: 'A private list',
            isPublic: false
        });

        // Create movies
        movie1 = await db.Movie.create({
            title: 'Movie 1',
            releaseYear: 2020,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        movie2 = await db.Movie.create({
            title: 'Movie 2',
            releaseYear: 2021,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        movie3 = await db.Movie.create({
            title: 'Movie 3',
            releaseYear: 2022,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Add movies to public list
        await db.MovieListMovie.create({
            movieListId: publicList.id,
            movieId: movie1.id,
            addedAt: new Date('2024-01-01')
        });

        await db.MovieListMovie.create({
            movieListId: publicList.id,
            movieId: movie2.id,
            addedAt: new Date('2024-01-02')
        });

        await db.MovieListMovie.create({
            movieListId: publicList.id,
            movieId: movie3.id,
            addedAt: new Date('2024-01-03')
        });
    });

    // HAPPY PATHS
    it('should return movie list by id', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: publicList.id
        };

        const result = await MovieList.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(publicList.id);
        expect(result.name).toBe('Public List');
        expect(result.description).toBe('A public list');
        expect(result.isPublic).toBe(true);
    });

    it('should return movie list with user information', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: publicList.id
        };

        const result = await MovieList.resolve(null, args, context);

        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(user1.id);
        expect(result.user.username).toBe('user1');
    });

    it('should return movie list with paginated movies', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: publicList.id,
            page: 1,
            limit: 2
        };

        const result = await MovieList.resolve(null, args, context);

        expect(result.movies).toBeDefined();
        expect(result.movies.length).toBe(2);
    });

    it('should return movies with position numbers', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: publicList.id
        };

        const result = await MovieList.resolve(null, args, context);

        expect(result.movies.length).toBe(3);
        expect(result.movies[0].position).toBe(1);
        expect(result.movies[1].position).toBe(2);
        expect(result.movies[2].position).toBe(3);
    });

    it('should paginate movies correctly', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Get first page
        const page1 = await MovieList.resolve(null, {
            id: publicList.id,
            page: 1,
            limit: 2
        }, context);

        // Get second page
        const page2 = await MovieList.resolve(null, {
            id: publicList.id,
            page: 2,
            limit: 2
        }, context);

        expect(page1.movies.length).toBe(2);
        expect(page2.movies.length).toBe(1);
        expect(page1.movies[0].position).toBe(1);
        expect(page1.movies[1].position).toBe(2);
        expect(page2.movies[0].position).toBe(3);
    });

    it('should allow owner to view private list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: privateList.id
        };

        const result = await MovieList.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(privateList.id);
        expect(result.isPublic).toBe(false);
    });

    it('should allow any user to view public list', async () => {
        const context = {
            user: {
                id: user2.id, // user2 viewing user1's public list
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: publicList.id
        };

        const result = await MovieList.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(publicList.id);
        expect(result.userId).toBe(user1.id); // Belongs to user1
    });

    it('should return empty movies array if no movies in list', async () => {
        const emptyList = await db.MovieList.create({
            userId: user1.id,
            name: 'Empty List',
            isPublic: true
        });

        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: emptyList.id
        };

        const result = await MovieList.resolve(null, args, context);

        expect(result.movies).toBeDefined();
        expect(result.movies.length).toBe(0);
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

        await expect(MovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie list not found');
    });

    it('should FAIL when non-owner tries to view private list', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to view user1's private list
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: privateList.id // private list belongs to user1
        };

        await expect(MovieList.resolve(null, args, context))
            .rejects
            .toThrow('You do not have permission to view this list');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: publicList.id
        };

        await expect(MovieList.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should respect default pagination limits', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // No pagination args - should use defaults
        const result = await MovieList.resolve(null, {
            id: publicList.id
        }, context);

        // Default limit is 5
        expect(result.movies.length).toBeLessThanOrEqual(5);
    });

    it('should limit maximum page size to 5', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Try to request more than max limit
        const result = await MovieList.resolve(null, {
            id: publicList.id,
            limit: 100 // Requesting 100, but should be capped at 5
        }, context);

        // Should return max 5 items (we only have 3 in the list)
        expect(result.movies.length).toBeLessThanOrEqual(5);
    });
});

