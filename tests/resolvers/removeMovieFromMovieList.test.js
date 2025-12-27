const { setupTestDB, db } = require('../helper');
const RemoveMovieFromMovieList = require('../../graphql/mutations/movieList/removeMovieFromMovieList');

setupTestDB();

describe('Mutation: removeMovieFromMovieList', () => {
    let userRole, user1, user2, movieList1, movieList2, movie1, movie2, movie3;

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
        movieList1 = await db.MovieList.create({
            userId: user1.id,
            name: 'My Favorites',
            description: 'My favorite movies',
            isPublic: false
        });

        movieList2 = await db.MovieList.create({
            userId: user2.id,
            name: 'User2 Favorites',
            description: 'User2 favorite movies',
            isPublic: true
        });

        // Create movies
        movie1 = await db.Movie.create({
            title: 'Inception',
            releaseYear: 2010,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        movie2 = await db.Movie.create({
            title: 'The Dark Knight',
            releaseYear: 2008,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        movie3 = await db.Movie.create({
            title: 'Interstellar',
            releaseYear: 2014,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Add movies to lists
        await db.MovieListMovie.create({
            movieListId: movieList1.id,
            movieId: movie1.id,
            addedAt: new Date()
        });

        await db.MovieListMovie.create({
            movieListId: movieList1.id,
            movieId: movie2.id,
            addedAt: new Date()
        });

        await db.MovieListMovie.create({
            movieListId: movieList1.id,
            movieId: movie3.id,
            addedAt: new Date()
        });
    });

    // HAPPY PATHS
    it('should remove movie from movie list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            movieListId: movieList1.id,
            movieId: movie1.id
        };

        const result = await RemoveMovieFromMovieList.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.movies.length).toBe(2);

        const movieIds = result.movies.map(m => m.id);
        expect(movieIds).not.toContain(movie1.id);
    });

    it('should verify movie is removed from database', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Verify entry exists
        let entry = await db.MovieListMovie.findOne({
            where: {
                movieListId: movieList1.id,
                movieId: movie1.id
            }
        });
        expect(entry).not.toBeNull();

        const args = {
            movieListId: movieList1.id,
            movieId: movie1.id
        };

        await RemoveMovieFromMovieList.resolve(null, args, context);

        // Verify entry no longer exists
        entry = await db.MovieListMovie.findOne({
            where: {
                movieListId: movieList1.id,
                movieId: movie1.id
            }
        });
        expect(entry).toBeNull();
    });

    it('should remove multiple movies from list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Remove first movie
        await RemoveMovieFromMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie1.id
        }, context);

        // Remove second movie
        const result = await RemoveMovieFromMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie2.id
        }, context);

        expect(result.movies.length).toBe(1);
        expect(result.movies[0].id).toBe(movie3.id);
    });

    it('should not affect movie in database when removing from list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            movieListId: movieList1.id,
            movieId: movie1.id
        };

        await RemoveMovieFromMovieList.resolve(null, args, context);

        // Verify movie still exists
        const movieStillExists = await db.Movie.findByPk(movie1.id);
        expect(movieStillExists).not.toBeNull();
        expect(movieStillExists.title).toBe('Inception');
    });

    it('should not affect other lists when removing from one', async () => {
        // Add movie1 to list2
        await db.MovieListMovie.create({
            movieListId: movieList2.id,
            movieId: movie1.id,
            addedAt: new Date()
        });

        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Remove from list1
        await RemoveMovieFromMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie1.id
        }, context);

        // Verify still in list2
        const entryInList2 = await db.MovieListMovie.findOne({
            where: {
                movieListId: movieList2.id,
                movieId: movie1.id
            }
        });
        expect(entryInList2).not.toBeNull();
    });

    it('should allow removing all movies from list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Remove all movies
        await RemoveMovieFromMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie1.id
        }, context);

        await RemoveMovieFromMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie2.id
        }, context);

        const result = await RemoveMovieFromMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie3.id
        }, context);

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
            movieListId: 99999,
            movieId: movie1.id
        };

        await expect(RemoveMovieFromMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie list not found');
    });

    it('should FAIL when user tries to remove from another user\'s list', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to remove from user1's list
                userRole: { name: 'user' }
            }
        };

        const args = {
            movieListId: movieList1.id, // list1 belongs to user1
            movieId: movie1.id
        };

        await expect(RemoveMovieFromMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You can only remove movies from your own lists');
    });

    it('should FAIL when movie is not in the list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Create a new movie not in the list
        const movie4 = await db.Movie.create({
            title: 'Not In List',
            releaseYear: 2020,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const args = {
            movieListId: movieList1.id,
            movieId: movie4.id
        };

        await expect(RemoveMovieFromMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie not found in this list');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            movieListId: movieList1.id,
            movieId: movie1.id
        };

        await expect(RemoveMovieFromMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You must be logged in to remove movies from a list');
    });

    it('should not affect other movies in list when removing one', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Remove movie1
        await RemoveMovieFromMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie1.id
        }, context);

        // Verify movie2 and movie3 still in list
        const entry2 = await db.MovieListMovie.findOne({
            where: { movieListId: movieList1.id, movieId: movie2.id }
        });
        const entry3 = await db.MovieListMovie.findOne({
            where: { movieListId: movieList1.id, movieId: movie3.id }
        });

        expect(entry2).not.toBeNull();
        expect(entry3).not.toBeNull();
    });
});

