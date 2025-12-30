const { setupTestDB, db } = require('../helper');
const CreateActor = require('../../graphql/mutations/actor/createActor');

setupTestDB();

describe('Mutation: createActor', () => {
    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
    });

    it('Should create a new actor when admin', async () => {
        const context = { user: { id: 1, userRole: { name: 'admin' } } };
        const args = {
           input: {
               name: 'Julia Roberts',
               birthDate: '10-28-1967',
               nationality: 'American',
           }
        };
        const res = await CreateActor.resolve(null, args, context);

        expect(res).toBeDefined();

        expect(res.name).toBe('Julia Roberts');
        expect(res.birthDate).toBe('1967-10-28');
        expect(res.nationality).toBe('American');

        const actorDb = await db.Actor.findOne({ where: {name: 'Julia Roberts'} });
        expect(actorDb).toBeDefined();
        expect(actorDb.birthDate).toBe('1967-10-28');
        expect(actorDb.nationality).toBe('American');
    });

    it('Should not create a new actor when user is not admin', async () => {
        const context = { user: { id: 2, userRole: { name: 'user' } } };
        const args = {
            input: {
                name: 'Jennifer Aniston',
                birthDate: '02-11-1969',
                nationality: 'American',
            }
        };
        await expect(CreateActor.resolve(null, args, context)).rejects.toThrow();
    });


});
