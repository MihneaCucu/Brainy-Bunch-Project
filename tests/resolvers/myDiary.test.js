const { setupTestDB, db } = require('../helper');
const MyDiary = require('../../graphql/queries/diary/myDiary');

setupTestDB();

describe('Query: myDiary', () => {
    describe('Happy path', () => {
        it('should require authentication', async () => {
            await expect(MyDiary.resolve(null, {}, {})).rejects.toThrow('Unauthentificated: Please log in');
        });

        it('should create a diary if none exists and return it', async () => {
            const userRole = await db.Role.create({ name: 'user' });
            const user = await db.User.create({ username: 'owner1', email: 'owner1@test.com', password: 'Owner1Pa55!', roleId: userRole.id });

            const context = { user: { id: user.id, userRole: { name: 'user' } } };

            const res = await MyDiary.resolve(null, {}, context);
            expect(res).toBeDefined();
            expect(res.userId).toBe(user.id);

            const found = await db.Diary.findOne({ where: { userId: user.id } });
            expect(found).toBeDefined();
            expect(found.id).toBe(res.id);
        });

        it('should return existing diary for the user', async () => {
            const userRole = await db.Role.create({ name: 'user' });
            const user = await db.User.create({ username: 'owner2', email: 'owner2@test.com', password: 'Owner2Pa55!', roleId: userRole.id });

            const diary = await db.Diary.create({ userId: user.id });

            const context = { user: { id: user.id, userRole: { name: 'user' } } };
            const res = await MyDiary.resolve(null, {}, context);
            expect(res).toBeDefined();
            expect(res.id).toBe(diary.id);
        });
    });

    describe('Sad path', () => {
        it('should throw error if user is not authenticated', async () => {
            await expect(MyDiary.resolve(null,{}, {})).rejects.toThrow('Unauthentificated: Please log in');
        })
    })

});
