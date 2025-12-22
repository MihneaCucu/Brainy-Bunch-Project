const { setupTestDB, db } = require('../helper');
const User = require('../../graphql/queries/user/user');

setupTestDB();

describe('Query: User (Single)', () => {
    let adminRole, userRole, adminUser, targetUser;

    beforeEach(async () => {
        adminRole = await db.Role.create({ name: 'admin' });
        userRole = await db.Role.create({ name: 'user' });

        adminUser = await db.User.create({
            username: 'admin', email: 'admin@test.com', password: 'AdminPa55!', roleId: adminRole.id
        });

        targetUser = await db.User.create({
            username: 'target', email: 'target@test.com', password: 'TargetPa55!', roleId: userRole.id
        });
    });

    it('should return a user if requested by an Admin', async () => {
        // Admin context
        const context = {
            user: { 
                id: adminUser.id, 
                userRole: { name: 'admin' } 
            }
        };

        const args = { id: targetUser.id };

        const result = await User.resolve(null, args, context);

        expect(result).not.toBeNull();
        expect(result.id).toBe(targetUser.id);
        expect(result.username).toBe('target');
        
        expect(result.userRole).toBeDefined();
        expect(result.userRole.name).toBe('user');
    });

    it('should return NULL if the user ID does not exist', async () => {
        const context = {
            user: { id: adminUser.id, userRole: { name: 'admin' } }
        };

        const args = { id: 99999 };

        const result = await User.resolve(null, args, context);

        expect(result).toBeNull();
    });

    it('should FAIL if a standard User tries to view a user', async () => {
        // Standard user context
        const context = {
            user: { 
                id: targetUser.id, 
                userRole: { name: 'user' } 
            }
        };

        const args = { id: adminUser.id };

        await expect(User.resolve(null, args, context))
            .rejects
            .toThrow("Unauthorized: You need to be a admin to perform this action.");
    });
});