const { setupTestDB, db } = require('../helper');
const UpdateUser = require('../../graphql/mutations/user/updateUser');

setupTestDB();

describe('Mutation: UpdateUser', () => {
    let adminRole, userRole, adminUser, standardUser, targetUser;

    beforeEach(async () => {
        adminRole = await db.Role.create({name: 'admin'});
        userRole = await db.Role.create({name: 'user'});


        adminUser = await db.User.create({
            username: 'admin', email: 'admin@test.com', password: 'AdminPa55!', roleId: adminRole.id
        });

        standardUser = await db.User.create({
        username: 'user', email: 'user@test.com', password: 'UserPa55!', roleId: userRole.id
        });

        targetUser = await db.User.create({
        username: 'target', email: 'target@test.com', password: 'TargetPa55!', roleId: userRole.id
        });
    });

    describe('Happy path', () => {
        it('should allow an Admin to update another user', async () => {
            const context = {
                user: { id: adminUser.id, userRole: { name: 'admin' } } // Mocking req.user
            };

            const args = {
                id: targetUser.id,
                username: 'updated_by_admin'
            };

            const result = await UpdateUser.resolve(null, args, context);

            expect(result.username).toBe('updated_by_admin');
            expect(result.email).toBe('target@test.com');   // Unchanged
        });

        it('should allow a User to update themselves', async () => {
            const context = {
                user: { id: standardUser.id, userRole: { name: 'user' } }
            };

            const args = {
                id: standardUser.id, // Self ID
                email: 'newemail@test.com'
            };

            const result = await UpdateUser.resolve(null, args, context);

            expect(result.email).toBe('newemail@test.com');
        });
    })

    describe('Sad path', () => {
        it('should FAIL if a standard User tries to update someone else', async () => {
            const context = {
                user: { id: standardUser.id, userRole: { name: 'user' } }
            };

            const args = {
                id: targetUser.id, // Different ID
                username: 'hacked'
            };

            // Expect the resolver to throw the authorization error
            await expect(UpdateUser.resolve(null, args, context))
                .rejects
                .toThrow("You are not authorized to edit this user.");
        });

        it('should throw error if User not found', async () => {
            const context = {
                user: { id: adminUser.id, userRole: { name: 'admin' } }
            };

            const args = { id: 99999, username: 'ghost' };

            await expect(UpdateUser.resolve(null, args, context))
                .rejects
                .toThrow("User not found");
        });
    })

});