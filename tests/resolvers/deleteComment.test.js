const { setupTestDB, db } = require('../helper');
const DeleteComment = require('../../graphql/mutations/comment/deleteComment');

setupTestDB();

describe('Mutation: deleteComment', () => {
    let userRole, moderatorRole, adminRole, user1, user2, moderator, admin;
    let movie, review, comment1, comment2;

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
            content: 'Comment from user1',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        comment2 = await db.Comment.create({
            userId: user2.id,
            reviewId: review.id,
            content: 'Comment from user2',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    describe('Happy path', () => {
        it('should allow user to delete their own comment', async () => {
            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const args = {
                id: comment1.id
            };

            const result = await DeleteComment.resolve(null, args, context);

            expect(result).toBe('Comment deleted successfully');

            // Verify comment is deleted
            const deletedComment = await db.Comment.findByPk(comment1.id);
            expect(deletedComment).toBeNull();
        });

        it('should allow moderator to delete any comment', async () => {
            const context = {
                user: {
                    id: moderator.id,
                    userRole: { name: 'moderator' }
                }
            };

            const args = {
                id: comment1.id // comment1 belongs to user1, not moderator
            };

            const result = await DeleteComment.resolve(null, args, context);

            expect(result).toBe('Comment deleted successfully');

            // Verify comment is deleted
            const deletedComment = await db.Comment.findByPk(comment1.id);
            expect(deletedComment).toBeNull();
        });

        it('should allow admin to delete any comment', async () => {
            const context = {
                user: {
                    id: admin.id,
                    userRole: { name: 'admin' }
                }
            };

            const args = {
                id: comment1.id // comment1 belongs to user1, not admin
            };

            const result = await DeleteComment.resolve(null, args, context);

            expect(result).toBe('Comment deleted successfully');

            // Verify comment is deleted
            const deletedComment = await db.Comment.findByPk(comment1.id);
            expect(deletedComment).toBeNull();
        });

        it('should verify comment is removed from database after deletion', async () => {
            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            // Verify comment exists before deletion
            let commentExists = await db.Comment.findByPk(comment1.id);
            expect(commentExists).not.toBeNull();

            const args = {
                id: comment1.id
            };

            await DeleteComment.resolve(null, args, context);

            // Verify comment no longer exists
            commentExists = await db.Comment.findByPk(comment1.id);
            expect(commentExists).toBeNull();
        });

        it('should not affect other comments when deleting one', async () => {
            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const args = {
                id: comment1.id
            };

            await DeleteComment.resolve(null, args, context);

            // Verify comment2 still exists
            const comment2StillExists = await db.Comment.findByPk(comment2.id);
            expect(comment2StillExists).not.toBeNull();
            expect(comment2StillExists.content).toBe('Comment from user2');
        });
    });

    describe ('Sad path', () => {
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

            await expect(DeleteComment.resolve(null, args, context))
                .rejects
                .toThrow('Comment not found');
        });

        it('should FAIL when regular user tries to delete another user\'s comment', async () => {
            const context = {
                user: {
                    id: user2.id, // user2 trying to delete user1's comment
                    userRole: { name: 'user' }
                }
            };

            const args = {
                id: comment1.id // comment1 belongs to user1
            };

            await expect(DeleteComment.resolve(null, args, context))
                .rejects
                .toThrow('Not authorized to delete this comment');

            // Verify comment still exists
            const commentStillExists = await db.Comment.findByPk(comment1.id);
            expect(commentStillExists).not.toBeNull();
        });

        it('should FAIL when user is not authenticated', async () => {
            const context = {}; // No user

            const args = {
                id: comment1.id
            };

            await expect(DeleteComment.resolve(null, args, context))
                .rejects
                .toThrow();
        });

        it('should not affect review when comment is deleted', async () => {
            const context = {
                user: {
                    id: user1.id,
                    userRole: { name: 'user' }
                }
            };

            const args = {
                id: comment1.id
            };

            await DeleteComment.resolve(null, args, context);

            // Verify review still exists
            const reviewStillExists = await db.Review.findByPk(review.id);
            expect(reviewStillExists).not.toBeNull();
            expect(reviewStillExists.content).toBe('Great movie!');
        });

        it('should allow deleting multiple comments sequentially', async () => {
            const context = {
                user: {
                    id: admin.id,
                    userRole: { name: 'admin' }
                }
            };

            // Delete first comment
            await DeleteComment.resolve(null, { id: comment1.id }, context);

            // Verify first is deleted
            let deleted1 = await db.Comment.findByPk(comment1.id);
            expect(deleted1).toBeNull();

            // Delete second comment
            await DeleteComment.resolve(null, { id: comment2.id }, context);

            // Verify second is deleted
            let deleted2 = await db.Comment.findByPk(comment2.id);
            expect(deleted2).toBeNull();
        });
    });
});

