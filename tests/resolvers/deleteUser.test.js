const { setupTestDB, db } = require('../helper');
const DeleteUser = require('../../graphql/mutations/user/deleteUser')

setupTestDB();

describe('Mutation: DeleteUser', () => {
  let adminRole, adminUser, targetUser;

  beforeEach(async () => {
    adminRole = await db.Role.create({ name: 'admin' });
    
    adminUser = await db.User.create({
      username: 'admin', email: 'admin@test.com', password: 'AdminPa55!', roleId: adminRole.id
    });
    
    targetUser = await db.User.create({
      username: 'target', email: 'target@test.com', password: 'TargetPa55!', roleId: adminRole.id
    });
  });

  describe('Happy path', () => {
    it('should allow Admin to delete another user', async () => {
      const context = {
        user: { id: adminUser.id, userRole: { name: 'admin' } }
      };

      const args = { id: targetUser.id };

      const result = await DeleteUser.resolve(null, args, context);

      expect(result).toBe("User deleted successfully");

      const found = await db.User.findByPk(targetUser.id);
      expect(found).toBeNull();
    });

    it('should PREVENT Admin from deleting themselves', async () => {
      const context = {
        user: { id: adminUser.id, userRole: { name: 'admin' } }
      };

      const args = { id: adminUser.id }; // Self ID

      await expect(DeleteUser.resolve(null, args, context))
          .rejects
          .toThrow("You cannot delete your own admin account.");

      // DB should still have the user
      const found = await db.User.findByPk(adminUser.id);
      expect(found).not.toBeNull();
    });
  });

  describe('Sad path', () => {
    it('should FAIL if the user to be deleted does not exists', async () => {
      const context = {
        user: { id: adminUser.id, userRole: { name: 'admin' } }
      }
      const args = { id: 999999999 };

      await expect(DeleteUser.resolve(null, args, context)).rejects.toThrow();
    })

  })
});