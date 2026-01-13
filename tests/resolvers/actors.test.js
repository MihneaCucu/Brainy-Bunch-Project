const { setupTestDB, db } = require('../helper');
const Actors = require('../../graphql/queries/actor/actors');
const Genres = require("../../graphql/queries/genre/genres");

setupTestDB();

describe('Query: Actors list', () => {
    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
    });

    describe('Happy Path', () => {
        it('should return an empty list when no actors exist', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };
            
            const res = await Actors.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res).toHaveLength(0);
        });

        it('should return a list of actors when data exists', async () => {
            await db.Actor.create({
                name: 'Julia Roberts',
                birthDate: '10-28-1967',
                nationality: 'American',
            });

            await db.Actor.create({
                name: 'Jennifer Aniston',
                birthDate: '02-11-1969',
                nationality: 'American',
            });

            await db.Actor.create({
                name: 'Sarah Jessica Parker',
                birthDate: '25-03-1965',
                nationality: 'American',
            });

            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const res = await Actors.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res).toHaveLength(3);
            expect(res[0]).toHaveProperty('name');
        });

    });

    describe('Sad Path', () => {
        it('should throw an error if the user is not authenticated', async () => {
            const context = {}; 

            await expect(Actors.resolve(null, {}, context))
                .rejects
                .toThrow();
        });
    })

    
})
