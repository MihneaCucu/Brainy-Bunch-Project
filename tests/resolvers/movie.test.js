const { setupTestDB, db } = require('../helper');
const MovieQuery = require('../../graphql/queries/movie/movie');

setupTestDB();

describe('Query: Movie by title', () => {
    let movie;
    let director;

    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });

        director = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });

        movie = await db.Movie.create({
            title: 'Inception',
            releaseYear: 2010,
            directorId: director.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    describe('Happy Path', () => {
        it('should return a movie when title exists', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const args = { title: 'Inception' };

            const res = await MovieQuery.resolve(null, args, context);

            expect(res).toBeDefined();
            expect(res.id).toBe(movie.id);
            expect(res.title).toBe('Inception');
            expect(res.releaseYear).toBe(2010);
        });
    });

    describe('Sad Path', () => {
        it('should throw when title not found', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            await expect(MovieQuery.resolve(null, { title: 'NonExistentMovie' }, context))
                .rejects
                .toThrow();
        });
    });
});
