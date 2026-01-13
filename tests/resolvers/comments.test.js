const { setupTestDB, db } = require('../helper');
const Comments = require('../../graphql/queries/comment/comments');

setupTestDB();

describe('Query: comments (List)', () => {
    let userRole, user1, user2, movie, review1, review2;

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

        // Create movie
        movie = await db.Movie.create({
            title: 'Test Movie',
            releaseYear: 2024,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Create reviews
        review1 = await db.Review.create({
            userId: user1.id,
            movieId: movie.id,
            score: 4,
            content: 'Great movie!',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        review2 = await db.Review.create({
            userId: user2.id,
            movieId: movie.id,
            score: 5,
            content: 'Masterpiece!',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    describe('Happy path', () => {
        it('should return empty array when no comments exist', async () => {
            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Comments.resolve(null, {}, context);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should return all comments', async () => {
            // Create comments
            await db.Comment.create({
                userId: user1.id,
                reviewId: review1.id,
                content: 'Comment 1',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Comment.create({
                userId: user2.id,
                reviewId: review1.id,
                content: 'Comment 2',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Comment.create({
                userId: user1.id,
                reviewId: review2.id,
                content: 'Comment 3',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Comments.resolve(null, {}, context);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);
        });

        it('should include user and review in comments', async () => {
            await db.Comment.create({
                userId: user1.id,
                reviewId: review1.id,
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

            const result = await Comments.resolve(null, {}, context);

            expect(result.length).toBe(1);
            expect(result[0].user).toBeDefined();
            expect(result[0].user.username).toBe('user1');
            expect(result[0].review).toBeDefined();
            expect(result[0].review.content).toBe('Great movie!');
        });

        it('should return comments with correct data', async () => {
            await db.Comment.create({
                userId: user1.id,
                reviewId: review1.id,
                content: 'This is a test comment',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Comments.resolve(null, {}, context);

            expect(result[0].content).toBe('This is a test comment');
            expect(result[0].userId).toBe(user1.id);
            expect(result[0].reviewId).toBe(review1.id);
        });

        it('should return multiple comments on same review', async () => {
            // Multiple comments on review1
            await db.Comment.create({
                userId: user1.id,
                reviewId: review1.id,
                content: 'Comment from user1',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Comment.create({
                userId: user2.id,
                reviewId: review1.id,
                content: 'Comment from user2',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Comments.resolve(null, {}, context);

            expect(result.length).toBe(2);

            const review1Comments = result.filter(c => c.reviewId === review1.id);
            expect(review1Comments.length).toBe(2);
        });

        it('should return comments from different users', async () => {
            await db.Comment.create({
                userId: user1.id,
                reviewId: review1.id,
                content: 'Comment from user1',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Comment.create({
                userId: user2.id,
                reviewId: review2.id,
                content: 'Comment from user2',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Comments.resolve(null, {}, context);

            expect(result.length).toBe(2);

            const userIds = result.map(c => c.userId);
            expect(userIds).toContain(user1.id);
            expect(userIds).toContain(user2.id);
        });

        it('should return comments on different reviews', async () => {
            await db.Comment.create({
                userId: user1.id,
                reviewId: review1.id,
                content: 'Comment on review1',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Comment.create({
                userId: user1.id,
                reviewId: review2.id,
                content: 'Comment on review2',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const result = await Comments.resolve(null, {}, context);

            expect(result.length).toBe(2);

            const reviewIds = result.map(c => c.reviewId);
            expect(reviewIds).toContain(review1.id);
            expect(reviewIds).toContain(review2.id);
        });

    });

    describe('Sad path', () => {
        it('should FAIL when user is not authenticated', async () => {
            const context = {}; // No user

            await expect(Comments.resolve(null, {}, context))
                .rejects
                .toThrow();
        });
    });
});

