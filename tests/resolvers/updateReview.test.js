const { setupTestDB, db } = require('../helper');
const UpdateReview = require('../../graphql/mutations/review/updateReview');

setupTestDB();

describe('Mutation: updateReview', () => {
    let user1, user2, movie, review1, review2, userRole;

    beforeEach(async () => {
        // Create role
        userRole = await db.Role.create({ name: 'user' });

        // Create users
        user1 = await db.User.create({
            username: 'owner',
            email: 'owner@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        user2 = await db.User.create({
            username: 'other',
            email: 'other@test.com',
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
            score: 3,
            content: 'Original review content',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        review2 = await db.Review.create({
            userId: user2.id,
            movieId: movie.id,
            score: 4,
            content: 'Another user review',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    // HAPPY PATHS
    it('should update review score by owner', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id,
            input : {
                score: 5
            }
        };

        const result = await UpdateReview.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.score).toBe(5);
        expect(result.content).toBe('Original review content'); // unchanged
    });

    it('should update review content by owner', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id,
            input: {
                content: 'Updated review content'
            }
        };

        const result = await UpdateReview.resolve(null, args, context);

        expect(result.content).toBe('Updated review content');
        expect(result.score).toBe(3); // unchanged
    });

    it('should update both score and content', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id,
            input : {
                score: 5,
                content: 'Completely updated review'
            }
        };

        const result = await UpdateReview.resolve(null, args, context);

        expect(result.score).toBe(5);
        expect(result.content).toBe('Completely updated review');
    });

    it('should update the updatedAt timestamp', async () => {
        const originalUpdatedAt = review1.updatedAt;

        // Wait a bit to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 10));

        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id,
            input : {
                score: 5
            }
        };

        const result = await UpdateReview.resolve(null, args, context);

        expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
            new Date(originalUpdatedAt).getTime()
        );
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
            id: 99999,
            input : {
                score: 5
            }
        };

        await expect(UpdateReview.resolve(null, args, context))
            .rejects
            .toThrow('Review not found');
    });

    it('should FAIL when user is not the owner', async () => {
        const context = {
            user: {
                id: user2.id, // user2 trying to update user1's review
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id,
            input : {
                score: 5
            }
        };

        await expect(UpdateReview.resolve(null, args, context))
            .rejects
            .toThrow('You are not authorized to update this review');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: review1.id,
            input : {
                score: 5
            }
        };

        await expect(UpdateReview.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should allow user to update their own review multiple times', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // First update
        let args = {
            id: review1.id,
            input: {
                score: 4
            }
        };
        let result = await UpdateReview.resolve(null, args, context);
        expect(result.score).toBe(4);

        // Second update
        args = {
            id: review1.id,
            input: {
                score: 5
            }
        };
        result = await UpdateReview.resolve(null, args, context);
        expect(result.score).toBe(5);

        // Third update
        args = {
            id: review1.id,
            input:{
                content: 'Final update'
            }
        };
        result = await UpdateReview.resolve(null, args, context);
        expect(result.content).toBe('Final update');
        expect(result.score).toBe(5); // preserved from previous update
    });
});

