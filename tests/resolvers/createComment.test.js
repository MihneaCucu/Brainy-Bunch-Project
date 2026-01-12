const { setupTestDB, db } = require('../helper');
const CreateComment = require('../../graphql/mutations/comment/createComment');

setupTestDB();

describe('Mutation: createComment', () => {
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

    // HAPPY PATHS
    it('should create comment on a review', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                reviewId: review1.id,
                content: 'I totally agree with this review!'
            }
        };

        const result = await CreateComment.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.content).toBe('I totally agree with this review!');
        expect(result.reviewId).toBe(review1.id);
        expect(result.userId).toBe(user1.id);
    });

    it('should create comment with user and review included', async () => {
        const context = {
            user: {
                id: user2.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                reviewId: review1.id,
                content: 'Nice review!'
            }
        };

        const result = await CreateComment.resolve(null, args, context);

        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(user2.id);
        expect(result.user.username).toBe('user2');
        expect(result.review).toBeDefined();
        expect(result.review.id).toBe(review1.id);
    });

    it('should allow multiple users to comment on same review', async () => {
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

        // User1 comments
        const comment1 = await CreateComment.resolve(null, {
            input: {
                reviewId: review1.id,
                content: 'Comment from user1'
            }
        }, context1);

        // User2 comments on same review
        const comment2 = await CreateComment.resolve(null, {
            input: {
                reviewId: review1.id,
                content: 'Comment from user2'
            }
        }, context2);

        expect(comment1.userId).toBe(user1.id);
        expect(comment2.userId).toBe(user2.id);
        expect(comment1.reviewId).toBe(review1.id);
        expect(comment2.reviewId).toBe(review1.id);
        expect(comment1.id).not.toBe(comment2.id);
    });

    it('should allow same user to comment on different reviews', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Comment on review1
        const comment1 = await CreateComment.resolve(null, {
            input: {
                reviewId: review1.id,
                content: 'Comment on review 1'
            }
        }, context);

        // Comment on review2
        const comment2 = await CreateComment.resolve(null, {
            input: {
                reviewId: review2.id,
                content: 'Comment on review 2'
            }
        }, context);

        expect(comment1.reviewId).toBe(review1.id);
        expect(comment2.reviewId).toBe(review2.id);
        expect(comment1.userId).toBe(user1.id);
        expect(comment2.userId).toBe(user1.id);
    });

    it('should allow same user to post multiple comments on same review', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // First comment
        const comment1 = await CreateComment.resolve(null, {
            input: {
                reviewId: review1.id,
                content: 'First comment'
            }
        }, context);

        // Second comment
        const comment2 = await CreateComment.resolve(null, {
            input: {
                reviewId: review1.id,
                content: 'Second comment'
            }
        }, context);

        expect(comment1.reviewId).toBe(review1.id);
        expect(comment2.reviewId).toBe(review1.id);
        expect(comment1.id).not.toBe(comment2.id);
    });

    it('should create comment and store in database', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                reviewId: review1.id,
                content: 'Test comment'
            }
        };

        const result = await CreateComment.resolve(null, args, context);

        // Verify comment is in database
        const commentInDb = await db.Comment.findByPk(result.id);
        expect(commentInDb).not.toBeNull();
        expect(commentInDb.content).toBe('Test comment');
        expect(commentInDb.reviewId).toBe(review1.id);
        expect(commentInDb.userId).toBe(user1.id);
    });

    // SAD PATHS
    it('should FAIL when content is empty', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                reviewId: review1.id,
                content: '   '
            }
        };

        await expect(CreateComment.resolve(null, args, context))
            .rejects
            .toThrow('Content cannot be empty');
    });

    it('should FAIL when review does not exist', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                reviewId: 99999,
                content: 'Comment on non-existent review'
            }
        };

        await expect(CreateComment.resolve(null, args, context))
            .rejects
            .toThrow('Review not found');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            input: {
                reviewId: review1.id,
                content: 'Unauthenticated comment'
            }
        };

        await expect(CreateComment.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should allow user to comment on their own review', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                reviewId: review1.id, // review1 belongs to user1
                content: 'Commenting on my own review'
            }
        };

        const result = await CreateComment.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.userId).toBe(user1.id);
        expect(result.reviewId).toBe(review1.id);
    });
});

