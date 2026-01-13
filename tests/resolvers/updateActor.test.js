const { setupTestDB, db } = require('../helper');
const UpdateActor = require('../../graphql/mutations/actor/updateActor');

setupTestDB();

describe('Mutation: updateActor', () => {
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
        it('Should update an actor when admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };
            
            const args = {
                id: actor.id,
                input: {
                    name: 'Jennifer Aniston',
                    birthDate: '1969-02-11',
                    nationality: 'American',
                }
            };

            const res = await UpdateActor.resolve(null, args, context);

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
    });

    describe('Sad Path', () => {
        it('Should not update an actor if actor id does not exist', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };
            
            const args = {
                id: 999999,
                input: {
                    name: 'Jennifer Aniston',
                    birthDate: '1969-02-11',
                    nationality: 'American',
                }
            };

            await expect(UpdateActor.resolve(null, args, context)).rejects.toThrow();
        });

        it('Should not update an actor if user is not admin', async () => {
            const context = { user: { id: 2, userRole: { name: 'user' } } };
            
            const args = {
                id: actor.id,
                input: {
                    name: 'Jennifer Aniston',
                    birthDate: '1969-02-11',
                    nationality: 'American',
                }
            };

            await expect(UpdateActor.resolve(null, args, context)).rejects.toThrow();
        });
    });
});