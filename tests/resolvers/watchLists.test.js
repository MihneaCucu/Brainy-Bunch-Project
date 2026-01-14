const { setupTestDB, db } = require('../helper');
const WatchLists = require('../../graphql/queries/watchList/watchLists');

setupTestDB();

describe('Query: watchLists', () => {

    let userRole, adminRole, user1, user2, admin;
    let watchList, watchListforUser2;

    beforeEach(async () => {
        await db.WatchlistMovie.destroy({ where: {}, truncate: true });
        await db.Watchlist.destroy({ where: {}, truncate: true });
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });

        userRole = await db.Role.create({ name: 'user' });
        adminRole = await db.Role.create({ name: 'admin' });

        user1 = await db.User.create({
            username: 'user1',
            email: 'user1@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        user2 = await db.User.create({
            username: 'user2',
            email: 'user2@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        admin = await db.User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Admin123!',
            roleId: adminRole.id
        });

        watchList = await db.Watchlist.create({
            name: 'My list 1',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now() + 1000),
        });

        watchListforUser2 = await db.Watchlist.create({
            name: 'List for user 2',
            description: 'best movies',
            userId: user2.id,
        });
    });

    describe('Happy Path', () => {
        it('should return all watchlists for an admin user', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };
            const args = { page: 1, limit: 5 };

            const result = await WatchLists.resolve(null, args, context);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0].name).toBe('My list 1');
            expect(result[1].name).toBe('List for user 2');
        });

        it('should handle pagination correctly', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };

            const args = { page: 1, limit: 1 };
            const result = await WatchLists.resolve(null, args, context);

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('My list 1');

            const args2 = { page: 2, limit: 1 };
            const result2 = await WatchLists.resolve(null, args2, context);

            expect(result2).toBeDefined();
            expect(result2.length).toBe(1);
            expect(result2[0].name).toBe('List for user 2');
        });
    });

    describe('Sad Path', () => {
        it('it should throw error if a user tries to acces the lists ', async () => {
            const contex = {user: {id: user1.id, userRole: {name: 'user'}}};
            const args ={page: 1};
            await expect(WatchLists.resolve(null, args, contex)).rejects.toThrow();
        });
    });

});