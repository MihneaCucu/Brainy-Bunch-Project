const { setupTestDB, db } = require('../helper');
const CreateDirector = require('../../graphql/mutations/director/createDirector');

setupTestDB();

describe('Mutation: createDirector', () => {
    let admin;

    beforeEach(async () => {
        await db.Director.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });

        const adminRole = await db.Role.create({ name: 'admin' });

        admin = await db.User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Pass123!',
            roleId: adminRole.id
        });
    });

    describe('Happy Path', () => {
        it('should create director when user is admin', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };
            const input = {
                name: 'Christopher Nolan',
                birthDate: '1970-07-30',
                nationality: 'British-American'
            };

            const result = await CreateDirector.resolve(null, { input }, context);

            expect(result).toBeDefined();
            expect(result.name).toBe('Christopher Nolan');
            expect(result.birthDate).toBe('1970-07-30');
            expect(result.nationality).toBe('British-American');
        });

        it('should create director with only name (optional fields)', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };
            const input = {
                name: 'Steven Spielberg'
            };

            const result = await CreateDirector.resolve(null, { input }, context);

            expect(result).toBeDefined();
            expect(result.name).toBe('Steven Spielberg');
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when user is not admin', async () => {
            const userRole = await db.Role.create({ name: 'user' });
            const regularUser = await db.User.create({
                username: 'user',
                email: 'user@test.com',
                password: 'Pass123!',
                roleId: userRole.id
            });

            const context = { user: { id: regularUser.id, userRole: { name: 'user' } } };
            const input = {
                name: 'Test Director'
            };

            await expect(CreateDirector.resolve(null, { input }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when user is not authenticated', async () => {
            const context = {};
            const input = {
                name: 'Test Director'
            };

            await expect(CreateDirector.resolve(null, { input }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when director with same name already exists', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };
            const input = {
                name: 'Christopher Nolan',
                birthDate: '1970-07-30',
                nationality: 'British-American'
            };

            // Create first director
            await CreateDirector.resolve(null, { input }, context);

            // Try to create second director with same name
            await expect(CreateDirector.resolve(null, { input }, context))
                .rejects
                .toThrow('A director with the name "Christopher Nolan" already exists.');
        });
    });
});

