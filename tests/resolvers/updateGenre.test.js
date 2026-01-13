const { setupTestDB, db } = require('../helper');
const UpdateGenre = require('../../graphql/mutations/genre/updateGenre');
const CreateActor = require("../../graphql/mutations/actor/createActor");

setupTestDB();

describe('Mutation: updateGenre', () => {
  let genre;

  beforeEach(async () => {
    await db.Genre.destroy({ where: {}, truncate: true });
    genre = await db.Genre.create({ name: 'SciFi' });
  });

  describe('Happy path', () => {
    it('should update genre when admin', async () => {
      const context = { user: { id: 1, userRole: { name: 'admin' } } };
      const args = { id: genre.id, input: { name: 'Science Fiction' } };

      const res = await UpdateGenre.resolve(null, args, context);

      expect(res).toBeDefined();
      expect(res.name).toBe('Science Fiction');
    });
  });
  describe('Sad path', () => {
    it('Should not update a  genre when user is not admin', async () => {
      const context = { user: { id: 2, userRole: { name: 'user' } } };
      const args = { id: genre.id, input: { name: 'Science Fiction' } };
      await expect(CreateActor.resolve(null, args, context)).rejects.toThrow();
    });
  })
});
