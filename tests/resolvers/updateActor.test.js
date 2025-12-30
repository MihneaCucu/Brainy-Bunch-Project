const { setupTestDB, db } = require('../helper');
const UpdateActor = require('../../graphql/mutations/actor/updateActor');
const updateActor = require("../../graphql/mutations/actor/updateActor");

setupTestDB();

describe('Mutation: updateActor', () => {
    let actor;

    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
        actor = await db.Actor.create({
            name: 'Julia Roberts',
            birthDate: '10-28-1967',
            nationality: 'American',
        });
    });

    it('Should update an actor when admin', async () => {
        const context = { user: { id: 1, userRole: { name: 'admin' } } };
        const args = {
            id:actor.id,
            input: {
                name: 'Jennifer Aniston',
                birthDate: '02-11-1969',
                nationality: 'American',
            }
        };

        const res = await updateActor.resolve(null, args, context);

        expect(res).toBeDefined();
        expect(res.name).toBe('Jennifer Aniston');
        expect(res.birthDate).toBe('1969-02-11');
        expect(res.nationality).toBe('American');

        const actorDb = await db.Actor.findByPk(actor.id);
        expect(actorDb).toBeDefined();
        expect(actorDb.name).toBe('Jennifer Aniston');
        expect(actorDb.birthDate).toBe('1969-02-11');
        expect(actorDb.nationality).toBe('American');
    });

    it('Should not update an actor if actor id does not exists ', async () => {
        const context = { user: { id: 2, userRole: { name: 'user' } } };
        const args = {
            id:999999,
            input: {
                name: 'Jennifer Aniston',
                birthDate: '02-11-1969',
                nationality: 'American',
            }
        };

        await expect(UpdateActor.resolve(null, args, context)).rejects.toThrow();
    })
});