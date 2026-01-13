const { setupTestDB, db } = require('../helper');
const CreateReview = require('../../graphql/mutations/review/createReview');

setupTestDB();

describe('Mutation: createReview', () => {
    let user1, user2, movie1, movie2, userRole;

    beforeEach(async () => {
        // Create roles
        userRole = await db.Role.create({ name: 'user' });

        // Create users
        user1 = await db.User.create({
            username: 'reviewer1',
            email: 'reviewer1@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        user2 = await db.User.create({
            username: 'reviewer2',
            email: 'reviewer2@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        // Create movies
        movie1 = await db.Movie.create({
            title: 'Test Movie 1',
            releaseYear: 2024,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        movie2 = await db.Movie.create({
            title: 'Test Movie 2',
            releaseYear: 2023,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    // HAPPY PATH
    it('should create review with valid data', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 4,
                content: 'Great movie! Loved the cinematography.'
            }
        };

        const result = await CreateReview.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.score).toBe(4);
        expect(result.content).toBe('Great movie! Loved the cinematography.');
        expect(result.movieId).toBe(movie1.id);
        expect(result.userId).toBe(user1.id);
    });

    it('should create review with minimum score (1)', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 1,
                content: 'Terrible movie'
            }
        };

        const result = await CreateReview.resolve(null, args, context);

        expect(result.score).toBe(1);
    });

    it('should create review with maximum score (5)', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 5,
                content: 'Masterpiece!'
            }
        };

        const result = await CreateReview.resolve(null, args, context);

        expect(result.score).toBe(5);
    });

    // SAD PATHS
    it('should FAIL when score is below 1', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 0,
                content: 'Invalid score'
            }
        };

        await expect(CreateReview.resolve(null, args, context))
            .rejects
            .toThrow('Score must be between 1 and 5');
    });

    it('should FAIL when score is above 5', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 15,
                content: 'Invalid score'
            }
        };

        await expect(CreateReview.resolve(null, args, context))
            .rejects
            .toThrow('Score must be between 1 and 5');
    });

    it('should FAIL when content is empty', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 4,
                content: '   '
            }
        };

        await expect(CreateReview.resolve(null, args, context))
            .rejects
            .toThrow('Content cannot be empty');
    });

    it('should FAIL when movie does not exist', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: 99999,
                score: 4,
                content: 'Review for non-existent movie'
            }
        };

        await expect(CreateReview.resolve(null, args, context))
            .rejects
            .toThrow('Movie not found');
    });

    it('should FAIL when user already reviewed the movie', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 4,
                content: 'First review'
            }
        };

        // Create first review
        await CreateReview.resolve(null, args, context);

        // Try to create second review for same movie
        const args2 = {
            input: {
                movieId: movie1.id,
                score: 5,
                content: 'Second review - should fail'
            }
        };

        await expect(CreateReview.resolve(null, args2, context))
            .rejects
            .toThrow('You have already reviewed this movie');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            input: {
                movieId: movie1.id,
                score: 4,
                content: 'Unauthenticated review'
            }
        };

        await expect(CreateReview.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should allow different users to review the same movie', async () => {
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

        const args = {
            input: {
                movieId: movie1.id,
                score: 4,
                content: 'Review from user 1'
            }
        };

        // User 1 reviews
        const review1 = await CreateReview.resolve(null, args, context1);
        expect(review1.userId).toBe(user1.id);

        // User 2 reviews same movie
        args.input.content = 'Review from user 2';
        const review2 = await CreateReview.resolve(null, args, context2);
        expect(review2.userId).toBe(user2.id);

        // Both reviews should exist
        expect(review1.id).not.toBe(review2.id);
    });

    it('should automatically add movie to user diary when creating review', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                movieId: movie1.id,
                score: 4,
                content: 'Great movie!'
            }
        };

        // Create review
        await CreateReview.resolve(null, args, context);

        // Check that diary was created for user
        const diary = await db.Diary.findOne({
            where: { userId: user1.id }
        });
        expect(diary).not.toBeNull();

        // Check that movie was added to diary
        const movieInDiary = await db.MovieDiary.findOne({
            where: {
                movieId: movie1.id,
                diaryId: diary.id
            }
        });
        expect(movieInDiary).not.toBeNull();
        expect(movieInDiary.watchedAt).toBeDefined();
    });

    it('should not duplicate movie in diary if already exists', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Create diary and add movie manually first
        const diary = await db.Diary.create({
            userId: user1.id
        });

        const firstWatchedAt = new Date('2024-01-01');
        await db.MovieDiary.create({
            movieId: movie1.id,
            diaryId: diary.id,
            watchedAt: firstWatchedAt
        });

        // Now create review
        const args = {
            input: {
                movieId: movie1.id,
                score: 4,
                content: 'Great movie!'
            }
        };

        await CreateReview.resolve(null, args, context);

        // Check that there's still only one entry in diary
        const movieEntries = await db.MovieDiary.findAll({
            where: {
                movieId: movie1.id,
                diaryId: diary.id
            }
        });

        expect(movieEntries.length).toBe(1);
        // Original watchedAt should be preserved
        expect(movieEntries[0].watchedAt.getTime()).toBe(firstWatchedAt.getTime());
    });
});

