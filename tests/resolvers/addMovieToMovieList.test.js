const { setupTestDB, db } = require('../helper');
const AddMovieToMovieList = require('../../graphql/mutations/movieList/addMovieToMovieList');

setupTestDB();

describe('Mutation: addMovieToMovieList', () => {
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
    });

    // HAPPY PATHS
    it('should add movie to movie list', async () => {
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

        const result = await AddMovieToMovieList.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(movieList1.id);
        expect(result.movies).toBeDefined();
        expect(result.movies.length).toBe(1);
        expect(result.movies[0].id).toBe(movie1.id);
    });

    it('should add movie with note', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            movieListId: movieList1.id,
            movieId: movie1.id,
            note: 'Must watch again!'
        };

        await AddMovieToMovieList.resolve(null, args, context);

        // Verify note was saved
        const entry = await db.MovieListMovie.findOne({
            where: {
                movieListId: movieList1.id,
                movieId: movie1.id
            }
        });

        expect(entry.note).toBe('Must watch again!');
    });

    it('should add multiple movies to same list', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Add first movie
        await AddMovieToMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie1.id
        }, context);

        // Add second movie
        await AddMovieToMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie2.id
        }, context);

        // Add third movie
        const result = await AddMovieToMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie3.id
        }, context);

        expect(result.movies.length).toBe(3);
    });

    it('should allow same movie in different lists', async () => {
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

        // Add movie1 to list1
        await AddMovieToMovieList.resolve(null, {
            movieListId: movieList1.id,
            movieId: movie1.id
        }, context1);

        // Add movie1 to list2
        await AddMovieToMovieList.resolve(null, {
            movieListId: movieList2.id,
            movieId: movie1.id
        }, context2);

        // Verify both lists have the movie
        const entry1 = await db.MovieListMovie.findOne({
            where: { movieListId: movieList1.id, movieId: movie1.id }
        });
        const entry2 = await db.MovieListMovie.findOne({
            where: { movieListId: movieList2.id, movieId: movie1.id }
        });

        expect(entry1).not.toBeNull();
        expect(entry2).not.toBeNull();
    });

    it('should store addedAt timestamp', async () => {
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

        await AddMovieToMovieList.resolve(null, args, context);

        const entry = await db.MovieListMovie.findOne({
            where: {
                movieListId: movieList1.id,
                movieId: movie1.id
            }
        });

        expect(entry.addedAt).toBeDefined();
        expect(entry.addedAt).toBeInstanceOf(Date);
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

        await expect(AddMovieToMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie list not found');
    });

    it('should FAIL when movie does not exist', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            movieListId: movieList1.id,
            movieId: 99999
        };

        await expect(AddMovieToMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie not found');
    });

    it('should FAIL when user tries to add to another user\'s list', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to add to user1's list
                userRole: { name: 'user' }
            }
        };

        const args = {
            movieListId: movieList1.id, // list1 belongs to user1
            movieId: movie1.id
        };

        await expect(AddMovieToMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You can only add movies to your own lists');
    });

    it('should FAIL when movie already exists in list', async () => {
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

        // Add movie first time
        await AddMovieToMovieList.resolve(null, args, context);

        // Try to add same movie again
        await expect(AddMovieToMovieList.resolve(null, args, context))
            .rejects
            .toThrow('Movie already exists in this list');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            movieListId: movieList1.id,
            movieId: movie1.id
        };

        await expect(AddMovieToMovieList.resolve(null, args, context))
            .rejects
            .toThrow('You must be logged in to add movies to a list');
    });
});

