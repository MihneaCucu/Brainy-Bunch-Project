const { setupTestDB, db } = require('../helper');
const DeleteGenre = require('../../graphql/mutations/genre/deleteGenre');
const CreateActor = require("../../graphql/mutations/actor/createActor");

setupTestDB();

describe('Mutation: deleteGenre', () => {
    let genre;

    beforeEach(async () => {
        await db.Genre.destroy({ where: {}, truncate: true });
        genre = await db.Genre.create({ name: 'Test' });
    });

    describe('Happy path', () => {
        it('should delete genre when admin', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };
            const args = { id: genre.id };

            const res = await DeleteGenre.resolve(null, args, context);
            expect(res).toBe('Genre deleted successfully');
        });
    })

    describe('Sad path', () => {
        it('Should not delete a genre when user is not admin', async () => {
            const context = { user: { id: 2, userRole: { name: 'user' } } };
            const args = { id: genre.id};
            await expect(CreateActor.resolve(null, args, context)).rejects.toThrow();
        });

    })
});
