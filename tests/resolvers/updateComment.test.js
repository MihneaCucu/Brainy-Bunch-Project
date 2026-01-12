const { setupTestDB, db } = require('../helper');
const UpdateComment = require('../../graphql/mutations/comment/updateComment');

setupTestDB();

describe('Mutation: updateComment', () => {
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
            content: 'Original comment from user1',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        comment2 = await db.Comment.create({
            userId: user2.id,
            reviewId: review.id,
            content: 'Original comment from user2',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    // HAPPY PATHS
    it('should update comment content by owner', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id,
            content: 'Updated comment content'
        };

        const result = await UpdateComment.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.content).toBe('Updated comment content');
        expect(result.id).toBe(comment1.id);
    });

    it('should return comment with user and review included', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id,
            content: 'Updated content'
        };

        const result = await UpdateComment.resolve(null, args, context);

        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(user1.id);
        expect(result.review).toBeDefined();
        expect(result.review.id).toBe(review.id);
    });

    it('should update the updatedAt timestamp', async () => {
        const originalUpdatedAt = comment1.updatedAt;

        // Wait a bit to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 10));

        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id,
            content: 'New content'
        };

        const result = await UpdateComment.resolve(null, args, context);

        expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
            new Date(originalUpdatedAt).getTime()
        );
    });

    it('should allow user to update their comment multiple times', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // First update
        let result = await UpdateComment.resolve(null, {
            id: comment1.id,
            content: 'First update'
        }, context);
        expect(result.content).toBe('First update');

        // Second update
        result = await UpdateComment.resolve(null, {
            id: comment1.id,
            content: 'Second update'
        }, context);
        expect(result.content).toBe('Second update');

        // Third update
        result = await UpdateComment.resolve(null, {
            id: comment1.id,
            content: 'Final update'
        }, context);
        expect(result.content).toBe('Final update');
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
            id: 99999,
            content: 'Update non-existent comment'
        };

        await expect(UpdateComment.resolve(null, args, context))
            .rejects
            .toThrow('Comment not found');
    });

    it('should FAIL when user is not the owner', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to update user1's comment
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id, // comment1 belongs to user1
            content: 'Unauthorized update'
        };

        await expect(UpdateComment.resolve(null, args, context))
            .rejects
            .toThrow('You are not authorized to update this comment');
    });

    it('should FAIL when content is empty', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id,
            content: '   '
        };

        await expect(UpdateComment.resolve(null, args, context))
            .rejects
            .toThrow('Content cannot be empty');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: comment1.id,
            content: 'Update'
        };

        await expect(UpdateComment.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should not affect other comments when updating one', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id,
            content: 'Updated comment1'
        };

        await UpdateComment.resolve(null, args, context);

        // Verify comment2 is unchanged
        const comment2StillSame = await db.Comment.findByPk(comment2.id);
        expect(comment2StillSame.content).toBe('Original comment from user2');
    });

    it('should preserve comment metadata when updating', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: comment1.id,
            content: 'New content'
        };

        const result = await UpdateComment.resolve(null, args, context);

        expect(result.id).toBe(comment1.id);
        expect(result.userId).toBe(user1.id);
        expect(result.reviewId).toBe(review.id);
        expect(result.content).toBe('New content'); // only content changed
    });
});

