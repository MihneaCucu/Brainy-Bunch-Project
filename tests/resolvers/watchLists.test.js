const { setupTestDB, db } = require('../helper');
const WatchLists = require('../../graphql/queries/watchList/watchLists');

setupTestDB();

describe('Query: watchLists', () => {

    let userRole, user1, user2;
    let watchList, watchList2, watchList3, watchList4, watchList5, watchList6, watchList7, watchList8;
    let  watchListforUser2;

    beforeEach(async () => {
        await db.WatchlistMovie.destroy({ where: {}, truncate: true });
        await db.Watchlist.destroy({ where: {}, truncate: true });
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });

        userRole = await db.Role.create({ name: 'user' });

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

    it('it should return  the list from user 1', async () => {
        const contex = {user: {id: user1.id, userRole: {name: 'admin'}}};

        const args ={
            page:1,
            limit:8,
        }

        const res = await WatchLists.resolve(null, args, contex);

        expect(res).toHaveLength(1);
        expect(res[0].name).toBe('My list 1');

    });

    it('it should throw error if a user tries to acces the lists ', async () => {
        const contex = {user: {id: user1.id, userRole: {name: 'user'}}};
        const args ={page: 1};
        await expect(WatchLists.resolve(null, args, contex)).rejects.toThrow();
    });
});