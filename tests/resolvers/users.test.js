const { setupTestDB, db } = require('../helper');
const Users = require('../../graphql/queries/user/users');

setupTestDB();

describe('Query: Users (List)', () => {
    let adminRole, userRole;

    beforeEach(async () => {
        adminRole = await db.Role.create({ name: 'admin' });
        userRole = await db.Role.create({ name: 'user' });

        await db.User.bulkCreate([
            { username: 'admin', email: 'admin@test.com', password: 'AdminPa55!', roleId: adminRole.id },
            { username: 'u1', email: 'u1@test.com', password: 'U1Pa55!', roleId: userRole.id },
            { username: 'u2', email: 'u2@test.com', password: 'U2Pa55!', roleId: userRole.id }
        ]);
    });

    it('should return ALL users if requested by an Admin', async () => {
        const context = {
            user: { userRole: { name: 'admin' } }
        };

        const result = await Users.resolve(null, {}, context);

        expect(result).toHaveLength(3);
        
        expect(result[0].username).toBeDefined();
        expect(result[0].userRole).toBeDefined();
    });

    it('should FAIL if a standard User tries to list users', async () => {
        const context = {
            user: { userRole: { name: 'user' } }
        };

        await expect(Users.resolve(null, {}, context))
            .rejects
            .toThrow("Unauthorized: You need to be a admin to perform this action.");
    });
});