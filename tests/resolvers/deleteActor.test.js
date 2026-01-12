const { setupTestDB, db } = require('../helper');
const DeleteActor = require("../../graphql/mutations/actor/deleteActor");


setupTestDB();
describe("'Mutation: deleteActor", () => {
    let actor;
    beforeEach(async () => {
        await db.Actor.destroy({ where: {}, truncate: true });
        actor = await db.Actor.create({
            name: 'Julia Roberts',
            birthDate: '10-28-1967',
            nationality: 'American',
        });
    });

    it('should delete actor when admin', async () => {
        const context = { user: { id: 1, userRole: { name: 'admin' } } };
        const args = { id: actor.id };

        const res = await DeleteActor.resolve(null, args, context);
        expect(res).toBe('Actor deleted successfully');

        const actorDb = await db.Actor.findByPk(actor.id);
        expect(actorDb).toBeNull();

    });

    it('should not delete actor when the id does not exists', async () => {
        const context = { user: { id: 1, userRole: { name: 'admin' } } };
        const args = { id: 1111111 };

        await expect(DeleteActor.resolve(null, args)).rejects.toThrow();

    });


});
