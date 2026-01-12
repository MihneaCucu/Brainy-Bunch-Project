const { setupTestDB, db } = require('../helper');
const UpdateDirector = require('../../graphql/mutations/director/updateDirector');

setupTestDB();

describe('Mutation: updateDirector', () => {
    let adminRole, moderatorRole, userRole, admin, moderator, user;
    let director1, director2;

    beforeEach(async () => {
        // Create roles
        adminRole = await db.Role.create({ name: 'admin' });
        moderatorRole = await db.Role.create({ name: 'moderator' });
        userRole = await db.Role.create({ name: 'user' });

        // Create users
        admin = await db.User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Pass123!',
            roleId: adminRole.id
        });

        moderator = await db.User.create({
            username: 'moderator',
            email: 'mod@test.com',
            password: 'Pass123!',
            roleId: moderatorRole.id
        });

        user = await db.User.create({
            username: 'user',
            email: 'user@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        // Create directors
        director1 = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });

        director2 = await db.Director.create({
            name: 'Quentin Tarantino',
            birthDate: '1963-03-27',
            nationality: 'American'
        });
    });

    // HAPPY PATHS
    it('should update director name when admin', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id,
            name: 'Christopher Edward Nolan'
        };

        const result = await UpdateDirector.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.name).toBe('Christopher Edward Nolan');
        expect(result.birthDate).toBe('1970-07-30'); // unchanged
        expect(result.nationality).toBe('British-American'); // unchanged
    });

    it('should FAIL when moderator tries to update director', async () => {
        const context = {
            user: {
                id: moderator.id,
                userRole: { name: 'moderator' }
            }
        };

        const args = {
            id: director1.id,
            nationality: 'British'
        };

        await expect(UpdateDirector.resolve(null, args, context)).rejects.toThrow(
            'Unauthorized: You need to be a admin to perform this action.'
        );
    });

    it('should update multiple fields at once', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id,
            name: 'Chris Nolan',
            birthDate: '1970-07-31',
            nationality: 'American'
        };

        const result = await UpdateDirector.resolve(null, args, context);

        expect(result.name).toBe('Chris Nolan');
        expect(result.birthDate).toBe('1970-07-31');
        expect(result.nationality).toBe('American');
    });

    it('should update only birthDate', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id,
            birthDate: '1971-08-01'
        };

        const result = await UpdateDirector.resolve(null, args, context);

        expect(result.birthDate).toBe('1971-08-01');
        expect(result.name).toBe('Christopher Nolan'); // unchanged
        expect(result.nationality).toBe('British-American'); // unchanged
    });

    it('should return director with movies included', async () => {
        // Create a movie for the director
        await db.Movie.create({
            title: 'Inception',
            releaseYear: 2010,
            directorId: director1.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id,
            nationality: 'British'
        };

        const result = await UpdateDirector.resolve(null, args, context);

        expect(result.movies).toBeDefined();
        expect(Array.isArray(result.movies)).toBe(true);
        expect(result.movies.length).toBe(1);
        expect(result.movies[0].title).toBe('Inception');
    });

    // SAD PATHS
    it('should FAIL when director does not exist', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: 99999,
            name: 'Test'
        };

        await expect(UpdateDirector.resolve(null, args, context))
            .rejects
            .toThrow('Director not found');
    });

    it('should FAIL when regular user tries to update director', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: director1.id,
            name: 'Test'
        };

        await expect(UpdateDirector.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: director1.id,
            name: 'Test'
        };

        await expect(UpdateDirector.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should FAIL when updating to an existing director name', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id,
            name: 'Quentin Tarantino' // director2's name
        };

        await expect(UpdateDirector.resolve(null, args, context))
            .rejects
            .toThrow('A director with the name "Quentin Tarantino" already exists.');
    });

    it('should allow updating to the same name (no change)', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id,
            name: 'Christopher Nolan', // same name
            nationality: 'British'
        };

        const result = await UpdateDirector.resolve(null, args, context);

        expect(result.name).toBe('Christopher Nolan');
        expect(result.nationality).toBe('British');
    });

    it('should allow updating director multiple times', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        // First update
        let result = await UpdateDirector.resolve(null, {
            id: director1.id,
            nationality: 'British'
        }, context);
        expect(result.nationality).toBe('British');

        // Second update
        result = await UpdateDirector.resolve(null, {
            id: director1.id,
            birthDate: '1971-01-01'
        }, context);
        expect(result.birthDate).toBe('1971-01-01');
        expect(result.nationality).toBe('British'); // preserved

        // Third update
        result = await UpdateDirector.resolve(null, {
            id: director1.id,
            name: 'Chris Nolan'
        }, context);
        expect(result.name).toBe('Chris Nolan');
        expect(result.birthDate).toBe('1971-01-01'); // preserved
        expect(result.nationality).toBe('British'); // preserved
    });
});

