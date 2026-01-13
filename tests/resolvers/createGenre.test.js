const { setupTestDB, db } = require('../helper');
const CreateGenre = require('../../graphql/mutations/genre/createGenre');
const CreateActor = require("../../graphql/mutations/actor/createActor");

setupTestDB();

describe('Mutation: createGenre', () => {
  beforeEach(async () => {
    await db.Genre.destroy({ where: {}, truncate: true });
  });

 describe('Happy path', () => {
   it('should create a genre when admin', async () => {
     const context = { user: { id: 1, userRole: { name: 'admin' } } };
     const args = { input: {name: 'Comedy'} };

     const res = await CreateGenre.resolve(null, args, context);

     expect(res).toBeDefined();
     expect(res.name).toBe('Comedy');
   });
 })
  describe('Sad path', () => {
    it('Should not create a new genre when user is not admin', async () => {
      const context = { user: { id: 2, userRole: { name: 'user' } } };
      const args = {
        input: {
          name: 'Comedy',
        }
      };
      await expect(CreateActor.resolve(null, args, context)).rejects.toThrow();
    });
  })
});
