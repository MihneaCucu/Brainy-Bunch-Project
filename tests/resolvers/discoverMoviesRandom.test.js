const { setupTestDB, db } = require('../helper');
const DiscoverMoviesRandom = require('../../graphql/queries/discoverMovies/discoverMoviesRandom');

setupTestDB();
describe('Query: discoverMoviesRandom', () => {
    let director;
    let user;

    const movies = [];
    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });

        const role = await db.Role.create({ name: 'user' });
        user = await db.User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123',
            roleId: role.id
        });

        director = await db.Director.create({ name: 'Director' });

        await db.Movie.create({
            title: 'Holiday',
            description: 'Romance',
            releaseYear: '2010',
            directorId: director.id,
        });

        await db.Movie.create({
            title: 'Nothing hill',
            description: 'Romance',
            releaseYear: '2012',
            directorId: director.id,
        });

        await db.Movie.create({
            title: 'Titanic',
            description: 'Drama',
            releaseYear: '2010',
            directorId: director.id
        });

        await db.Movie.create({
            title: 'Terminator',
            description: 'Action',
            releaseYear: '2012',
            directorId: director.id,
        });

        await db.Movie.create({
            title: 'Fast and furios',
            description: 'Action',
            releaseYear: '2012',
            directorId: director.id,
        });

        await db.Movie.create({
            title: 'Fast and furios 2',
            description: 'Action',
            releaseYear: '2012',
            directorId: director.id,
        });

        await db.Movie.create({
            title: 'Fast and furios 3',
            description: 'Action',
            releaseYear: '2012',
            directorId: director.id,
        });

        await db.Movie.create({
            title: 'Fast and furios 4 ',
            description: 'Action',
            releaseYear: '2012',
            directorId: director.id,
        });

        await db.Movie.create({
            title: 'Friends',
            description: 'Romance',
            releaseYear: '2010',
            directorId: director.id,
        });


    });

    const getContext = () => ({
        user: {
            id: user.id,
            role: 'user'
        }
    });

    it('Should return 5 movies', async () => {
        const args = {};
        const res = await DiscoverMoviesRandom.resolve(null, args, getContext());

        expect(res).toHaveLength(5);
    });

    it('Should return an empty array', async () => {
        await db.Movie.destroy({ where: {}, truncate: true });

        const args = {};
        const res = await DiscoverMoviesRandom.resolve(null, args, getContext());
        expect(res).toHaveLength(0);
        expect(res).toEqual([]);
    });
});