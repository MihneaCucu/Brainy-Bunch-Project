const { setupTestDB, db } = require('../helper');
const DeleteWatchList = require('../../graphql/mutations/watchList/deleteWatchList');
const UpdateWatchList = require("../../graphql/mutations/watchList/updateWatchList");
const {args: watchList, user1} = require("../../graphql/queries/user/user");

setupTestDB();

describe('Mutation: deleteWatchList', () => {

    let user,user2,watchList;

    beforeEach(async () => {

        await db.Watchlist.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });

        const userRole = await db.Role.create({ name: 'user' });

        user = await db.User.create({
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

        watchList = await db.Watchlist.create({
            name: 'watch1',
            description: 'original',
            userId: user.id,
        });
    });

    it('Should delete a watch list', async () => {
        const context = {user: {id: user.id}};

        const args = { id:  watchList.id }

        const res = await DeleteWatchList.resolve(null, args, context);

        expect(res).toBe('Watch list deleted successfully');

        const updateDb = await db.Watchlist.findByPk(watchList.id);
        expect(updateDb).toBeNull();
    });

    it('Should throw error if watchlist not found', async () => {
        const context = {user: {id: user.id}};

        const args = { id:  9999999999 }

        await expect(DeleteWatchList.resolve(null, args, context)).rejects.toThrow('Watch list not found');

    });
});
