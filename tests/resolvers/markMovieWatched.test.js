const { setupTestDB, db } = require('../helper');
const MarkMovieWatched = require('../../graphql/mutations/diary/markMovieWatched');

setupTestDB();

describe('Mutation: markMovieWatched', () => {
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.MovieDiary.destroy({ where: {}, truncate: true });
        await db.Diary.destroy({ where: {}, truncate: true });
        await db.Review.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
    });

    it('requires authentication', async () => {
        await expect(MarkMovieWatched.resolve(null, { movieId: 1 }, {}))
        .rejects
        .toThrow('You must be logged in to mark a movie as watched');
    });

    it('fails when movie does not exist', async () => {
        const role = await db.Role.create({ name: 'user' });
        const user = await db.User.create({ username: 'u1', email: 'u1@test.com', password: 'U1Pa55!', roleId: role.id });

        const context = { user: { id: user.id, userRole: { name: 'user' } } };

        await expect(MarkMovieWatched.resolve(null, { movieId: 9999 }, context))
        .rejects
        .toThrow('Movie not found');
    });

    it('creates diary and movieDiary when marking watched', async () => {
        const role = await db.Role.create({ name: 'user' });
        const user = await db.User.create({ username: 'u2', email: 'u2@test.com', password: 'U2Pa55!', roleId: role.id });
        const movie = await db.Movie.create({ title: 'Test Movie', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });

        const context = { user: { id: user.id, userRole: { name: 'user' } } };

        const res = await MarkMovieWatched.resolve(null, { movieId: movie.id }, context);

        // diary should exist
        const diary = await db.Diary.findOne({ where: { userId: user.id } });
        expect(diary).toBeDefined();

        // MovieDiary entry should exist
        const md = await db.MovieDiary.findOne({ where: { diaryId: diary.id, movieId: movie.id } });
        expect(md).toBeDefined();
    });

    it('prevents duplicate marking', async () => {
        const role = await db.Role.create({ name: 'user' });
        const user = await db.User.create({ username: 'u3', email: 'u3@test.com', password: 'U3Pa55!', roleId: role.id });
        const movie = await db.Movie.create({ title: 'Test Movie 2', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });

        const context = { user: { id: user.id, userRole: { name: 'user' } } };

        // first time should succeed
        await MarkMovieWatched.resolve(null, { movieId: movie.id }, context);

        await expect(MarkMovieWatched.resolve(null, { movieId: movie.id }, context))
        .rejects
        .toThrow('Movie already marked as watched in your diary');
    });

    it('creates a review when review arg provided', async () => {
        const role = await db.Role.create({ name: 'user' });
        const user = await db.User.create({ username: 'u4', email: 'u4@test.com', password: 'U4Pa55!', roleId: role.id });
        const movie = await db.Movie.create({ title: 'Test Movie 3', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });

        const context = { user: { id: user.id, userRole: { name: 'user' } } };

        const reviewArg = { score: 9, content: 'Great movie' };

        await MarkMovieWatched.resolve(null, { movieId: movie.id, review: reviewArg }, context);

        const review = await db.Review.findOne({ where: { movieId: movie.id, userId: user.id } });
        
        expect(review).toBeDefined();
        expect(review.content).toBe('Great movie');
    });
});
