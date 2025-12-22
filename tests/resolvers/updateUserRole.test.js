const { setupTestDB, db } = require('../helper');
const UpdateUserRole = require('../../graphql/mutations/user/updateUserRole');

setupTestDB();

describe('Mutation: UpdateUserRole', () => {
    let adminUser, standardUser, adminRole, userRole;

    beforeEach(async () => {
        adminRole = await db.Role.create({ name: 'admin' });
        userRole = await db.Role.create({ name: 'user' });

        adminUser = await db.User.create({
            username: 'admin', email: 'admin@test.com', password: 'AdminPa55!', roleId: adminRole.id
        });

        standardUser = await db.User.create({
            username: 'user', email: 'user@test.com', password: 'UserPa55!', roleId: userRole.id
        });
    });

    it('should allow Admin to promote a user', async () => {
        const context = {
            user: { id: adminUser.id, userRole: { name: 'admin' } }
        };

        const args = {
            userId: standardUser.id,
            newRoleId: adminRole.id // Promoting 'user' to 'admin'
        };

        const result = await UpdateUserRole.resolve(null, args, context);

        expect(result.id).toBe(standardUser.id);
        

        const updatedUser = await db.User.findByPk(standardUser.id);
        expect(updatedUser.roleId).toBe(adminRole.id);
    });

    it('should FAILs if the user to update is not found', async () => {
        const context = {
            user: { id: adminUser.id, userRole: { name: 'admin' } }
        };

        const args = {
            userId: 99999,
            newRoleId: userRole.id
        };

        await expect(UpdateUserRole.resolve(null, args, context))
            .rejects
            .toThrow("User not found");
    });

    it('should FAIL if a non-admin tries to update roles', async () => {
        const context = {
            user: { id: standardUser.id, userRole: { name: 'user' } }
        };

        const args = {
            userId: standardUser.id,
            newRoleId: adminRole.id // User trying to promote themselves
        };

        await expect(UpdateUserRole.resolve(null, args, context))
            .rejects
            .toThrow('Unauthorized: You need to be a admin to perform this action.'); 
    });
});