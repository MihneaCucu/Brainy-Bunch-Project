const { setupTestDB, db } = require('../helper');
const RemoveMovieFromMovieList = require('../../graphql/mutations/movieList/removeMovieFromMovieList');

setupTestDB();

describe('Mutation: removeMovieFromMovieList', () => {
    let user;
    let movieList;
    let movie1;
    let movie2;

    beforeEach(async () => {
        await db.MovieListMovie.destroy({ where: {}, truncate: true });
        await db.MovieList.destroy({ where: {}, truncate: true });
        await db.Movie.destroy({ where: {}, truncate: true });
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
            name: 'My Favorites',
            description: 'My favorite movies',
            isPublic: false
        });

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

        // Add movies to list
        await db.MovieListMovie.create({
            movieListId: movieList.id,
            movieId: movie1.id,
            addedAt: new Date()
        });

        await db.MovieListMovie.create({
            movieListId: movieList.id,
            movieId: movie2.id,
            addedAt: new Date()
        });
    });

    describe('Happy Path', () => {
        it('should remove movie from movie list', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: movieList.id,
                movieId: movie1.id
            };

            const result = await RemoveMovieFromMovieList.resolve(null, { input }, context);

            expect(result).toBeDefined();
            expect(result.movies.length).toBe(1);

            const movieIds = result.movies.map(m => m.id);
            expect(movieIds).not.toContain(movie1.id);
            expect(movieIds).toContain(movie2.id);
        });

        it('should verify movie is removed from database', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            // Verify entry exists
            let entry = await db.MovieListMovie.findOne({
                where: {
                    movieListId: movieList.id,
                    movieId: movie1.id
                }
            });
            expect(entry).not.toBeNull();

            const input = {
                movieListId: movieList.id,
                movieId: movie1.id
            };

            await RemoveMovieFromMovieList.resolve(null, { input }, context);

            // Verify entry no longer exists
            entry = await db.MovieListMovie.findOne({
                where: {
                    movieListId: movieList.id,
                    movieId: movie1.id
                }
            });
            expect(entry).toBeNull();
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when movie list does not exist', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: 9999,
                movieId: movie1.id
            };

            await expect(RemoveMovieFromMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow('Movie list not found');
        });

        it('should throw an error when user tries to remove from another user\'s list', async () => {
            const otherUser = await db.User.create({
                username: 'other',
                email: 'other@example.com',
                password: 'Password123!',
                roleId: user.roleId
            });

            const context = { user: { id: otherUser.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: movieList.id,
                movieId: movie1.id
            };

            await expect(RemoveMovieFromMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow('You can only remove movies from your own lists');
        });

        it('should throw an error when movie is not in the list', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            const movie3 = await db.Movie.create({
                title: 'Not In List',
                releaseYear: 2020,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const input = {
                movieListId: movieList.id,
                movieId: movie3.id
            };

            await expect(RemoveMovieFromMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow('Movie not found in this list');
        });

        it('should throw an error when user is not authenticated', async () => {
            const context = {};
            const input = {
                movieListId: movieList.id,
                movieId: movie1.id
            };

            await expect(RemoveMovieFromMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow();
        });
    });
});

