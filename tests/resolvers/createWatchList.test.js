const { setupTestDB, db } = require('../helper');
const CreateWatchList = require('../../graphql/mutations/watchList/createWatchList');
const {args: userRole, user} = require("../../graphql/queries/user/user");
setupTestDB();

describe('Mutation: CreateWatchList', () => {

    let user;
    beforeEach( async () => {

        const userRole = await db.Role.create({ name: 'user' });

        user = await db.User.create({
            username: 'user1',
            email: 'user1@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

    });

    it('Should create a new Watch list when user', async () => {
        const context = {
            user: {
                id: user.id,
            }
        };

        const args = {
            input: {
                name: 'My Watch List',
                description: "description",
            }
        };

        const res = await CreateWatchList.resolve(null, args, context);

        expect(res).toBeDefined();
        expect(res.name).toBe('My Watch List');
        expect(res.description).toBe('description');
        expect(res.userId).toBe(user.id);

        const watchDb = await db.Watchlist.findOne({ where: { name: 'My Watch List' } });
        expect(watchDb).toBeDefined();
        expect(watchDb.name).toBe('My Watch List');
        expect(watchDb.description).toBe('description');
        expect(watchDb.userId).toBe(user.id);
    });

    it('Should throw error if user is NOT logged in ', async () => {
        const context = {};
        const args = {
            input: {
                name: 'My Watch List',
                description: "description",
            }
        };

        await expect(CreateWatchList.resolve(null, args, context)).rejects.toThrow();
    });

});