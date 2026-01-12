const { setupTestDB, db } = require('../helper');
const Actor = require('../../graphql/queries/actor/actor');


setupTestDB();

describe('Query: Actor by id', () => {
    let actor;

    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
        actor = await db.Actor.create({
            name: 'Julia Roberts',
            birthDate: '10-28-1967',
            nationality: 'American',
        });
    });

    it('should return an actor when  id exists', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        const args = {id: actor.id};

        const res = await Actor.resolve(null, args, context);

        expect(res).toBeDefined();
        expect(res.id).toBe(actor.id);
        expect(res.name).toBe('Julia Roberts');
        expect(res.birthDate).toBe('1967-10-28');
        expect(res.nationality).toBe('American');
    });

    it('should throw when id not found', async () => {
        const context = { user: { id: 1, userRole: { name: 'user' } } };

        await expect(Actor.resolve(null, { id: 99999 }, context)).rejects.toThrow();
    });

});