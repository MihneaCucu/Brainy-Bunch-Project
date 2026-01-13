const { setupTestDB, db } = require('../helper');
const UpdateDirector = require('../../graphql/mutations/director/updateDirector');

setupTestDB();

describe('Mutation: updateDirector', () => {
    let admin;
    let director;

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

        director = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });
    });

    describe('Happy Path', () => {
        it('should update director when user is admin', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };
            const input = {
                name: 'Christopher Edward Nolan',
                birthDate: '1970-08-01',
                nationality: 'British'
            };

            const result = await UpdateDirector.resolve(null, { id: director.id, input }, context);

            expect(result.name).toBe('Christopher Edward Nolan');
            expect(result.birthDate).toBe('1970-08-01');
            expect(result.nationality).toBe('British');
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when director does not exist', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };
            const input = { name: 'New Name' };

            await expect(UpdateDirector.resolve(null, { id: 9999, input }, context))
                .rejects
                .toThrow('Director not found');
        });

        it('should throw an error when user is not admin', async () => {
            const userRole = await db.Role.create({ name: 'user' });
            const regularUser = await db.User.create({
                username: 'user',
                email: 'user@test.com',
                password: 'Pass123!',
                roleId: userRole.id
            });

            const context = { user: { id: regularUser.id, userRole: { name: 'user' } } };
            const input = { name: 'New Name' };

            await expect(UpdateDirector.resolve(null, { id: director.id, input }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when user is not authenticated', async () => {
            const context = {};
            const input = { name: 'New Name' };

            await expect(UpdateDirector.resolve(null, { id: director.id, input }, context))
                .rejects
                .toThrow();
        });
    });
});

