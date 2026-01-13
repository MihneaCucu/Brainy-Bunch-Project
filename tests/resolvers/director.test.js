const { setupTestDB, db } = require('../helper');
const Director = require('../../graphql/queries/director/director');

setupTestDB();

describe('Query: Director by name', () => {
    let director;

    beforeEach(async () => {
        await db.Director.destroy({ where: {}, truncate: true });
        director = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American',
        });
    });

    describe('Happy Path', () => {
        it('should return a director when name exists', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const args = { input: { name: 'Christopher Nolan' } };

            const res = await Director.resolve(null, args, context);

            expect(res).toBeDefined();
            expect(res.id).toBe(director.id);
            expect(res.name).toBe('Christopher Nolan');
            expect(res.birthDate).toBe('1970-07-30');
            expect(res.nationality).toBe('British-American');
        });
    });

    describe('Sad Path', () => {
        it('should throw when name not found', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            await expect(Director.resolve(null, { input: { name: 'Director Inexistent' } }, context))
                .rejects
                .toThrow();
        });
    });
});

