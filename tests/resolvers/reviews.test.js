const { setupTestDB, db } = require('../helper');
const Reviews = require('../../graphql/queries/review/reviews');

setupTestDB();

describe('Query: reviews (List)', () => {
    let user1, user2, movie1, movie2, userRole;

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

        // Create movies
        movie1 = await db.Movie.create({
            title: 'Movie 1',
            releaseYear: 2024,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        movie2 = await db.Movie.create({
            title: 'Movie 2',
            releaseYear: 2023,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    describe('Happy Path', () => {
        it('should return all reviews', async () => {
            // Create reviews
            await db.Review.create({
                userId: user1.id,
                movieId: movie1.id,
                score: 4,
                content: 'Review 1',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Review.create({
                userId: user2.id,
                movieId: movie2.id,
                score: 5,
                content: 'Review 2',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Reviews.resolve(null, {}, context);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });

        it('should include movie, user, and comments in reviews', async () => {
            // Create review
            const review = await db.Review.create({
                userId: user1.id,
                movieId: movie1.id,
                score: 4,
                content: 'Test review',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Create comment
            await db.Comment.create({
                userId: user2.id,
                reviewId: review.id,
                content: 'Test comment',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Reviews.resolve(null, {}, context);

            expect(result.length).toBe(1);
            expect(result[0].user).toBeDefined();
            expect(result[0].user.username).toBe('user1');
            expect(result[0].movie).toBeDefined();
            expect(result[0].movie.title).toBe('Movie 1');
            expect(result[0].comments).toBeDefined();
            expect(result[0].comments.length).toBe(1);
        });

        it('should return reviews with correct data', async () => {
            await db.Review.create({
                userId: user1.id,
                movieId: movie1.id,
                score: 5,
                content: 'Amazing movie!',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Reviews.resolve(null, {}, context);

            expect(result[0].score).toBe(5);
            expect(result[0].content).toBe('Amazing movie!');
            expect(result[0].userId).toBe(user1.id);
            expect(result[0].movieId).toBe(movie1.id);
        });

        it('should return multiple reviews for the same movie by different users', async () => {
            // User 1 reviews movie 1
            await db.Review.create({
                userId: user1.id,
                movieId: movie1.id,
                score: 4,
                content: 'User 1 review',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // User 2 reviews movie 1
            await db.Review.create({
                userId: user2.id,
                movieId: movie1.id,
                score: 5,
                content: 'User 2 review',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Reviews.resolve(null, {}, context);

            expect(result.length).toBe(2);

            const movie1Reviews = result.filter(r => r.movieId === movie1.id);
            expect(movie1Reviews.length).toBe(2);
        });
    });

    describe('Sad Path', () => {
        it('should FAIL when user is not authenticated', async () => {
            const context = {}; // No user

            await expect(Reviews.resolve(null, {}, context))
                .rejects
                .toThrow();
        });
    });
});

