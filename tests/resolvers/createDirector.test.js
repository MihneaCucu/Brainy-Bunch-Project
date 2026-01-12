const { setupTestDB, db } = require('../helper');
const CreateDirector = require('../../graphql/mutations/director/createDirector');

setupTestDB();

describe('Mutation: createDirector', () => {
    let adminRole, moderatorRole, userRole, admin, moderator, user;

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
    });

    // HAPPY PATHS
    it('should create director when admin', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        };

        const result = await CreateDirector.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.name).toBe('Christopher Nolan');
        expect(result.birthDate).toBe('1970-07-30');
        expect(result.nationality).toBe('British-American');
    });

    it('should FAIL when moderator tries to create director', async () => {
        const context = {
            user: {
                id: moderator.id,
                userRole: { name: 'moderator' }
            }
        };

        const args = {
            name: 'Quentin Tarantino',
            birthDate: '1963-03-27',
            nationality: 'American'
        };

        await expect(CreateDirector.resolve(null, args, context)).rejects.toThrow(
            'Unauthorized: You need to be a admin to perform this action.'
        );
    });

    it('should create director with only name (optional fields)', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            name: 'Steven Spielberg'
        };

        const result = await CreateDirector.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.name).toBe('Steven Spielberg');
        expect(result.birthDate).toBeUndefined();
        expect(result.nationality).toBeUndefined();
    });

    it('should create director with partial information', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            name: 'Denis Villeneuve',
            nationality: 'Canadian'
        };

        const result = await CreateDirector.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.name).toBe('Denis Villeneuve');
        expect(result.nationality).toBe('Canadian');
        expect(result.birthDate).toBeUndefined();
    });

    // SAD PATHS
    it('should FAIL when regular user tries to create director', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            name: 'Test Director'
        };

        await expect(CreateDirector.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            name: 'Test Director'
        };

        await expect(CreateDirector.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should FAIL when director with same name already exists', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        };

        // Create first director
        await CreateDirector.resolve(null, args, context);

        // Try to create second director with same name
        await expect(CreateDirector.resolve(null, args, context))
            .rejects
            .toThrow('A director with the name "Christopher Nolan" already exists.');
    });

    it('should allow creating directors with similar but different names', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        // Create first director
        const result1 = await CreateDirector.resolve(null, {
            name: 'Christopher Nolan'
        }, context);

        // Create second director with different name
        const result2 = await CreateDirector.resolve(null, {
            name: 'Jonathan Nolan'
        }, context);

        expect(result1.name).toBe('Christopher Nolan');
        expect(result2.name).toBe('Jonathan Nolan');
        expect(result1.id).not.toBe(result2.id);
    });

    it('should create director and store in database', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            name: 'Martin Scorsese',
            birthDate: '1942-11-17',
            nationality: 'American'
        };

        const result = await CreateDirector.resolve(null, args, context);

        // Verify director is in database
        const directorInDb = await db.Director.findByPk(result.id);
        expect(directorInDb).not.toBeNull();
        expect(directorInDb.name).toBe('Martin Scorsese');
        expect(directorInDb.birthDate).toBe('1942-11-17');
        expect(directorInDb.nationality).toBe('American');
    });
});

