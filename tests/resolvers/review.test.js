const { setupTestDB, db } = require('../helper');
const Review = require('../../graphql/queries/review/review');

setupTestDB();

describe('Query: review (Single)', () => {
    let user1, user2, movie1, review1, review2, userRole;

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
        movie1 = await db.Movie.create({
            title: 'Test Movie',
            releaseYear: 2024,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Create reviews
        review1 = await db.Review.create({
            userId: user1.id,
            movieId: movie1.id,
            score: 4,
            content: 'Great movie with stunning visuals!',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        review2 = await db.Review.create({
            userId: user2.id,
            movieId: movie1.id,
            score: 5,
            content: 'Masterpiece!',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    // HAPPY PATHS
    it('should return review by id', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        const result = await Review.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(review1.id);
        expect(result.score).toBe(4);
        expect(result.content).toBe('Great movie with stunning visuals!');
        expect(result.userId).toBe(user1.id);
        expect(result.movieId).toBe(movie1.id);
    });

    it('should return review with user information', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        const result = await Review.resolve(null, args, context);

        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(user1.id);
        expect(result.user.username).toBe('user1');
    });

    it('should return review with movie information', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        const result = await Review.resolve(null, args, context);

        expect(result.movie).toBeDefined();
        expect(result.movie.id).toBe(movie1.id);
        expect(result.movie.title).toBe('Test Movie');
        expect(result.movie.releaseYear).toBe(2024);
    });

    it('should return review with comments', async () => {
        // Create a comment on the review
        const comment = await db.Comment.create({
            userId: user2.id,
            reviewId: review1.id,
            content: 'I totally agree with this review!',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        const result = await Review.resolve(null, args, context);

        expect(result.comments).toBeDefined();
        expect(Array.isArray(result.comments)).toBe(true);
        expect(result.comments.length).toBe(1);
        expect(result.comments[0].id).toBe(comment.id);
        expect(result.comments[0].content).toBe('I totally agree with this review!');
    });

    it('should return review with empty comments array if no comments exist', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id
        };

        const result = await Review.resolve(null, args, context);

        expect(result.comments).toBeDefined();
        expect(Array.isArray(result.comments)).toBe(true);
        expect(result.comments.length).toBe(0);
    });

    it('should return different reviews based on different ids', async () => {
        const context = {
            user: {
                id: user1.id,
                userRole: { name: 'user' }
            }
        };

        // Get first review
        const result1 = await Review.resolve(null, { id: review1.id }, context);
        expect(result1.id).toBe(review1.id);
        expect(result1.content).toBe('Great movie with stunning visuals!');
        expect(result1.score).toBe(4);

        // Get second review
        const result2 = await Review.resolve(null, { id: review2.id }, context);
        expect(result2.id).toBe(review2.id);
        expect(result2.content).toBe('Masterpiece!');
        expect(result2.score).toBe(5);

        // Verify they are different
        expect(result1.id).not.toBe(result2.id);
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

        await expect(Review.resolve(null, args, context))
            .rejects
            .toThrow('Not found');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: review1.id
        };

        await expect(Review.resolve(null, args, context))
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

        await expect(Review.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should allow any authenticated user to view any review', async () => {
        const context = {
            user: {
                id: user2.id, // user2 viewing user1's review
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: review1.id // review1 belongs to user1
        };

        const result = await Review.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(review1.id);
        expect(result.userId).toBe(user1.id); // Not user2
    });
});

