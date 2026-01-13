const { setupTestDB, db } = require('../helper');
const Actor = require('../../graphql/queries/actor/actor');


setupTestDB();

describe('Query: Actor by name', () => {
    let actor;

    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
        actor = await db.Actor.create({
            name: 'Julia Roberts',
            birthDate: '1967-10-28',
            nationality: 'American',
        });
    });

    describe('Happy Path', () => {
        it('should return an actor when name exists', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const args = {name: 'Julia Roberts'};

            const res = await Actor.resolve(null, args, context);

            expect(res).toBeDefined();
            expect(res.id).toBe(actor.id);
            expect(res.name).toBe('Julia Roberts');
            expect(res.birthDate).toBe('1967-10-28');
            expect(res.nationality).toBe('American');
        });
    });

    describe('Sad Path', () => {        
        it('should throw when name not found', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            await expect(Actor.resolve(null, { name: 'Actor Inexistent' }, context))
                .rejects
                .toThrow();
        });
    });
    
});