const { setupTestDB, db } = require('../helper');
const DeleteReview = require('../../graphql/mutations/review/deleteReview');

setupTestDB();

describe('Mutation: deleteReview', () => {
    let user1, user2, moderator, admin, movie, review1, review2, userRole, moderatorRole, adminRole;

    beforeEach(async () => {
        // Create roles
        userRole = await db.Role.create({ name: 'user' });
        moderatorRole = await db.Role.create({ name: 'moderator' });
        adminRole = await db.Role.create({ name: 'admin' });

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

        moderator = await db.User.create({
            username: 'moderator',
            email: 'mod@test.com',
            password: 'Pass123!',
            roleId: moderatorRole.id
        });

        admin = await db.User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Pass123!',
            roleId: adminRole.id
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
            content: 'User 1 review',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        review2 = await db.Review.create({
            userId: user2.id,
            movieId: movie.id,
            score: 3,
            content: 'User 2 review',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    // HAPPY PATHS
    it('should allow user to delete their own review', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        const result = await DeleteReview.resolve(null, args, context);

        expect(result).toBe('Review deleted successfully');

        // Verify review is deleted
        const deletedReview = await db.Review.findByPk(review1.id);
        expect(deletedReview).toBeNull();
    });

    it('should allow moderator to delete any review', async () => {
        const context = {
            user: {
                id: moderator.id,
                userRole: { name: 'moderator' }
            }
        };

        const args = {
            id: review1.id // review1 belongs to user1, not moderator
        };

        const result = await DeleteReview.resolve(null, args, context);

        expect(result).toBe('Review deleted successfully');

        // Verify review is deleted
        const deletedReview = await db.Review.findByPk(review1.id);
        expect(deletedReview).toBeNull();
    });

    it('should allow admin to delete any review', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: review1.id // review1 belongs to user1, not admin
        };

        const result = await DeleteReview.resolve(null, args, context);

        expect(result).toBe('Review deleted successfully');

        // Verify review is deleted
        const deletedReview = await db.Review.findByPk(review1.id);
        expect(deletedReview).toBeNull();
    });

    // SAD PATHS
    it('should FAIL when review does not exist', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: 99999
        };

        await expect(DeleteReview.resolve(null, args, context))
            .rejects
            .toThrow('Review not found');
    });

    it('should FAIL when regular user tries to delete another user\'s review', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to delete user1's review
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        await expect(DeleteReview.resolve(null, args, context))
            .rejects
            .toThrow('Not authorized to delete this review');

        // Verify review still exists
        const stillExists = await db.Review.findByPk(review1.id);
        expect(stillExists).not.toBeNull();
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: review1.id
        };

        await expect(DeleteReview.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should delete review and verify it cannot be queried again', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Verify review exists before deletion
        let review = await db.Review.findByPk(review1.id);
        expect(review).not.toBeNull();

        const args = {
            id: review1.id
        };

        await DeleteReview.resolve(null, args, context);

        // Verify review no longer exists
        review = await db.Review.findByPk(review1.id);
        expect(review).toBeNull();
    });

    it('should not affect other reviews when deleting one', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        await DeleteReview.resolve(null, args, context);

        // Verify review2 still exists
        const review2StillExists = await db.Review.findByPk(review2.id);
        expect(review2StillExists).not.toBeNull();
        expect(review2StillExists.content).toBe('User 2 review');
    });
});

