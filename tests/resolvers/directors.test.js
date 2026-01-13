const { setupTestDB, db } = require('../helper');
const Directors = require('../../graphql/queries/director/directors');

setupTestDB();

describe('Query: Directors list', () => {
    beforeEach(async () => {
        await db.Director.destroy({ where: {}, truncate: true });
    });

    describe('Happy Path', () => {
        it('should return an empty list when no directors exist', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const res = await Directors.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res).toHaveLength(0);
        });

        it('should return a list of directors when data exists', async () => {
            await db.Director.create({
                name: 'Christopher Nolan',
                birthDate: '1970-07-30',
                nationality: 'British-American',
            });

            await db.Director.create({
                name: 'Quentin Tarantino',
                birthDate: '1963-03-27',
                nationality: 'American',
            });

            await db.Director.create({
                name: 'Steven Spielberg',
                birthDate: '1946-12-18',
                nationality: 'American',
            });

            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const res = await Directors.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res).toHaveLength(3);
            expect(res[0]).toHaveProperty('name');
        });
    });

    describe('Sad Path', () => {
        it('should throw an error if the user is not authenticated', async () => {
            const context = {};

            await expect(Directors.resolve(null, {}, context))
                .rejects
                .toThrow();
        });
    });
});

