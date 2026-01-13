const { setupTestDB, db } = require('../helper');
const AddMovieToMovieList = require('../../graphql/mutations/movieList/addMovieToMovieList');

setupTestDB();

describe('Mutation: addMovieToMovieList', () => {
    let user;
    let movieList;
    let movie;

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

        movie = await db.Movie.create({
            title: 'Inception',
            releaseYear: 2010,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    describe('Happy Path', () => {
        it('should add movie to movie list', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: movieList.id,
                movieId: movie.id
            };

            const result = await AddMovieToMovieList.resolve(null, { input }, context);

            expect(result).toBeDefined();
            expect(result.id).toBe(movieList.id);
            expect(result.movies).toBeDefined();
            expect(result.movies.length).toBe(1);
            expect(result.movies[0].id).toBe(movie.id);
        });

        it('should add movie with note', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: movieList.id,
                movieId: movie.id,
                note: 'Must watch again!'
            };

            await AddMovieToMovieList.resolve(null, { input }, context);

            const entry = await db.MovieListMovie.findOne({
                where: {
                    movieListId: movieList.id,
                    movieId: movie.id
                }
            });

            expect(entry.note).toBe('Must watch again!');
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when movie list does not exist', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: 9999,
                movieId: movie.id
            };

            await expect(AddMovieToMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow('Movie list not found');
        });

        it('should throw an error when movie does not exist', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: movieList.id,
                movieId: 9999
            };

            await expect(AddMovieToMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow('Movie not found');
        });

        it('should throw an error when user tries to add to another user\'s list', async () => {
            const otherUser = await db.User.create({
                username: 'other',
                email: 'other@example.com',
                password: 'Password123!',
                roleId: user.roleId
            });

            const context = { user: { id: otherUser.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: movieList.id,
                movieId: movie.id
            };

            await expect(AddMovieToMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow('You can only add movies to your own lists');
        });

        it('should throw an error when movie already exists in list', async () => {
            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const input = {
                movieListId: movieList.id,
                movieId: movie.id
            };

            // Add movie first time
            await AddMovieToMovieList.resolve(null, { input }, context);

            // Try to add same movie again
            await expect(AddMovieToMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow('Movie already exists in this list');
        });

        it('should throw an error when user is not authenticated', async () => {
            const context = {};
            const input = {
                movieListId: movieList.id,
                movieId: movie.id
            };

            await expect(AddMovieToMovieList.resolve(null, { input }, context))
                .rejects
                .toThrow();
        });
    });
});

