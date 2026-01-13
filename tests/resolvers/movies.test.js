const { setupTestDB, db } = require('../helper');
const MoviesQuery = require('../../graphql/queries/movie/movies');

setupTestDB();

describe('Query: Movies (List)', () => {
    let director;

    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });

        director = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });
    });

    describe('Happy Path', () => {
        it('should return an empty list when no movies exist', async () => {
            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const res = await MoviesQuery.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res).toHaveLength(0);
        });

        it('should return a list of movies when data exists', async () => {
            await db.Movie.create({
                title: 'Inception',
                releaseYear: 2010,
                directorId: director.id,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Movie.create({
                title: 'The Dark Knight',
                releaseYear: 2008,
                directorId: director.id,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await db.Movie.create({
                title: 'Interstellar',
                releaseYear: 2014,
                directorId: director.id,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const context = { user: { id: 1, userRole: { name: 'user' } } };

            const res = await MoviesQuery.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res).toHaveLength(3);
            expect(res[0]).toHaveProperty('title');
        });
    });

    describe('Sad Path', () => {
        it('should throw an error if the user is not authenticated', async () => {
            const context = {};

            await expect(MoviesQuery.resolve(null, {}, context))
                .rejects
                .toThrow();
        });
    });
});
