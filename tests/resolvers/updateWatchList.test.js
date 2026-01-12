const { setupTestDB, db } = require('../helper');
const UpdateWatchList = require('../../graphql/mutations/watchList/updateWatchList');

setupTestDB();

describe('Mutation: updateWatchList', () => {

    let user1, watchList;
    beforeEach(async () => {
        await db.Watchlist.destroy({where: {}, truncate: true});

        const userRole = await db.Role.create({ name: 'user' });

        user1 = await db.User.create({
            username: 'user1',
            email: 'user1@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });


        watchList = await db.Watchlist.create({
            name: 'watch1',
            description: 'original',
            userId: user1.id,
        });
    });

    it('Should create a new Watch list when user1 is owner', async () => {
        const context = {user: {id: user1.id}};

        const args = {
            id:  watchList.id,
            input: {
                name: 'New name',
                description: 'New description'
            }
        }

        const res = await UpdateWatchList.resolve(null, args, context);

        expect(res.id).toBe(watchList.id);
        expect(res.name).toBe('New name');
        expect(res.description).toBe('New description');

        const updateDb = await db.Watchlist.findByPk(watchList.id);
        expect(updateDb.name).toBe('New name');
    });


    it('Should update only update the new field ', async () => {
        const context = {user: {id: user1.id}};
        const args = {
            id:  watchList.id,
            input: {
                name: 'New name',
            }
        }

        const res = await UpdateWatchList.resolve(null, args, context);

        expect(res.id).toBe(watchList.id);
        expect(res.name).toBe('New name');
        expect(res.description).toBe('original');
    });


    it('Should throw error if watchlist does not exist', async () => {
        const context = {user: {id: user1.id}};
        const args = {
            id: 9999999,
            input: {
                name: 'New name',
            }
        };

        await expect(UpdateWatchList.resolve(null, args, context)).rejects.toThrow();
    });
});