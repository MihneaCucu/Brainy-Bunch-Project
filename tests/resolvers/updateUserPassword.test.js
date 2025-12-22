const bcrypt = require('bcrypt');
const { setupTestDB, db } = require('../helper');
const UpdateUserPassword = require('../../graphql/mutations/user/updateUserPassword');

setupTestDB();

describe('Mutation: UpdateUserPassword', () => {
    let adminUser, standardUser, targetUser;
    const knownPassword = 'KnownPa55!';

    beforeEach(async () => {
        // there are hooks that will hash the password on create/update.
        const adminRole = await db.Role.create({ name: 'admin' });
        const userRole = await db.Role.create({ name: 'user' });

        adminUser = await db.User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: knownPassword,
            roleId: adminRole.id
        });

        standardUser = await db.User.create({
            username: 'user',
            email: 'user@test.com',
            password: knownPassword,
            roleId: userRole.id
        });
        
        targetUser = await db.User.create({
            username: 'target',
            email: 'target@test.com',
            password: knownPassword,
            roleId: userRole.id
        });
    });

    it('should allow User to update their OWN password if oldPassword matches', async () => {

        const context = {
            user: { id: standardUser.id, userRole: { name: 'user' } }
        };

        const args = {
            userId: standardUser.id,
            oldPassword: knownPassword, // The plain text matches the hash in DB
            newPassword: 'NewPa55!'
        };

        const result = await UpdateUserPassword.resolve(null, args, context);

        expect(result.id).toBe(standardUser.id);

        const updatedUser = await db.User.findByPk(standardUser.id);

        expect(await bcrypt.compare('NewPa55!', updatedUser.password)).toBe(true);
        expect(await bcrypt.compare(knownPassword, updatedUser.password)).toBe(false);
    });


    it('should FAIL if User provides wrong oldPassword', async () => {
        const context = {
            user: { id: standardUser.id, userRole: { name: 'user' } }
        };

        const args = {
            userId: standardUser.id,
            oldPassword: 'WRONG_PASSWORD', 
            newPassword: 'NewPa55!'
        };

        await expect(UpdateUserPassword.resolve(null, args, context))
            .rejects
            .toThrow("Password incorrect!");
    });

    it('should FAIL if User does not provide oldPassword', async () => {
        const context = {
            user: { id: standardUser.id, userRole: { name: 'user' } }
        };

        const args = {
            userId: standardUser.id,
            // oldPassword is undefined
            newPassword: 'NewPa55!'
        };

        await expect(UpdateUserPassword.resolve(null, args, context))
            .rejects
            .toThrow("Old password is required");
    });

    it('should allow Admin to update ANY password WITHOUT oldPassword', async () => {
        const context = {
            user: { id: adminUser.id, userRole: { name: 'admin' } }
        };

        const args = {
            userId: targetUser.id, // Admin updating Target
            // No oldPassword provided
            newPassword: 'adminChangedIt'
        };

        const result = await UpdateUserPassword.resolve(null, args, context);
        expect(result.id).toBe(targetUser.id);

        const updatedTarget = await db.User.findByPk(targetUser.id);

        expect(await bcrypt.compare('adminChangedIt', updatedTarget.password)).toBe(true);
        expect(await bcrypt.compare(knownPassword, updatedTarget.password)).toBe(false);
    });

    it('should PREVENT a standard user from changing ANOTHER user\'s password', async () => {
        const context = {
            user: { id: standardUser.id, userRole: { name: 'user' } }
        };

        const args = {
            userId: targetUser.id, // Standard user trying to hack Target
            oldPassword: knownPassword, 
            newPassword: 'hacked'
        };

        await expect(UpdateUserPassword.resolve(null, args, context))
            .rejects
            .toThrow("You are not authorized to change this password.");
    });
});