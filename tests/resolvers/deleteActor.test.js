const { setupTestDB, db } = require('../helper');
const DeleteActor = require("../../graphql/mutations/actor/deleteActor");


setupTestDB();
describe("Mutation: deleteActor", () => {
    let actor;
    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
        actor = await db.Actor.create({
            name: 'Julia Roberts',
            birthday: '1967-10-28',
            nationality: 'American',
        });
    });

    describe('Happy Path', () => {
        it('should delete actor when admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };
            const args = { id: actor.id };

            const res = await DeleteActor.resolve(null, args, context);
            expect(res).toBe('Actor deleted successfully');

            const actorDb = await db.Actor.findByPk(actor.id);
            expect(actorDb).toBeNull();

        });
    });

    describe('Sad Path', () => {
        it('should not delete actor when not admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };
            const args = { id: actor.id };

            await expect(DeleteActor.resolve(null, args, context))
                .rejects
                .toThrow();
        });
    });

});
