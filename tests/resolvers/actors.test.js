const { setupTestDB, db } = require('../helper');
const Actors = require('../../graphql/queries/actor/actors');
const Genres = require("../../graphql/queries/genre/genres");

setupTestDB();

describe('Query: Actors list', () => {
    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
    });

    it('should return any actors', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        const res = await Actors.resolve(null, {}, context);

        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(0);
    });

    it('should list actors', async () => {
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
        expect(res.length).toBeGreaterThanOrEqual(3);
    });

})