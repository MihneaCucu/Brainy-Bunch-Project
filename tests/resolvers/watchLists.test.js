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
            createdAt: new Date(Date.now + 1000),
        });

        watchList2 = await db.Watchlist.create({
            name: 'My list 2',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now + 2000),
        });

        watchList3 = await db.Watchlist.create({
            name: 'My list 3',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now + 3000),
        });

        watchList4 = await db.Watchlist.create({
            name: 'My list 4',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now + 4000),
        });

        watchList5  = await db.Watchlist.create({
            name: 'My list 5',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now + 5000),
        });

        watchList6 = await db.Watchlist.create({
            name: 'My list 6',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now + 6000),
        });

        watchList7 = await db.Watchlist.create({
            name: 'My list 7',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now + 7000),
        });

        watchList8 = await db.Watchlist.create({
            name: 'My list 8',
            description: 'best movies',
            userId: user1.id,
            createdAt: new Date(Date.now + 8000),
        });

        watchListforUser2 = await db.Watchlist.create({
            name: 'List for user 2',
            description: 'best movies',
            userId: user2.id,
        });
    });

    it('it should return 5 list from user 1', async () => {
        const contex = {user: {id: user1.id}}

        const args ={
            page:1,
            limit:8,
        }

        const res = await WatchLists.resolve(null, args, contex);

        expect(res).toHaveLength(5);
        expect(res[0].name).toBe('My list 1');

    });

    it('it should not return watchlist what belongs to user 2', async () => {
        const contex = {user: {id: user1.id}}
        const args ={page: 1};

        const res = await WatchLists.resolve(null, args, contex);

        res.forEach(list => {
            expect(list.name).not.toBe('List for user 2');
            expect(list.userId).toBe(user1.id);
        });
    });
});