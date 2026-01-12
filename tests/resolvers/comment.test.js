const { setupTestDB, db } = require('../helper');
const Comment = require('../../graphql/queries/comment/comment');

setupTestDB();

describe('Query: comment (Single)', () => {
    let userRole, user1, user2, movie, review, comment1, comment2;

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

        // Create review
        review = await db.Review.create({
            userId: user1.id,
            movieId: movie.id,
            score: 4,
            content: 'Great movie!',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Create comments
        comment1 = await db.Comment.create({
            userId: user1.id,
            reviewId: review.id,
            content: 'First comment',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        comment2 = await db.Comment.create({
            userId: user2.id,
            reviewId: review.id,
            content: 'Second comment',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    // HAPPY PATHS
    it('should return comment by id', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id
        };

        const result = await Comment.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(comment1.id);
        expect(result.content).toBe('First comment');
        expect(result.userId).toBe(user1.id);
        expect(result.reviewId).toBe(review.id);
    });

    it('should return comment with user information', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id
        };

        const result = await Comment.resolve(null, args, context);

        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(user1.id);
        expect(result.user.username).toBe('user1');
    });

    it('should return comment with review information', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id
        };

        const result = await Comment.resolve(null, args, context);

        expect(result.review).toBeDefined();
        expect(result.review.id).toBe(review.id);
        expect(result.review.content).toBe('Great movie!');
        expect(result.review.score).toBe(4);
    });

    it('should return different comments based on different ids', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Get first comment
        const result1 = await Comment.resolve(null, { id: comment1.id }, context);
        expect(result1.id).toBe(comment1.id);
        expect(result1.content).toBe('First comment');

        // Get second comment
        const result2 = await Comment.resolve(null, { id: comment2.id }, context);
        expect(result2.id).toBe(comment2.id);
        expect(result2.content).toBe('Second comment');

        // Verify they are different
        expect(result1.id).not.toBe(result2.id);
    });

    it('should return comment with all relationships', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id
        };

        const result = await Comment.resolve(null, args, context);

        expect(result.user).toBeDefined();
        expect(result.user.username).toBe('user1');
        expect(result.review).toBeDefined();
        expect(result.review.userId).toBe(user1.id);
    });

    it('should return comment created by different user than review owner', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment2.id // comment2 is by user2 on user1's review
        };

        const result = await Comment.resolve(null, args, context);

        expect(result.userId).toBe(user2.id); // comment by user2
        expect(result.review.userId).toBe(user1.id); // review by user1
    });

    it('should return comment with timestamps', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id
        };

        const result = await Comment.resolve(null, args, context);

        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });

    // SAD PATHS
    it('should FAIL when comment does not exist', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: 99999
        };

        await expect(Comment.resolve(null, args, context))
            .rejects
            .toThrow('Not found');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: comment1.id
        };

        await expect(Comment.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should FAIL when id is null', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: null
        };

        await expect(Comment.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should allow any authenticated user to view any comment', async () => {
        const context = {
            user: {
                id: user2.id, // user2 viewing user1's comment
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id // comment1 belongs to user1
        };

        const result = await Comment.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(comment1.id);
        expect(result.userId).toBe(user1.id); // Not user2
    });
});

