const { setupTestDB, db } = require('../helper');
const DiscoverMoviesByFilter = require('../../graphql/queries/discoverMovies/discoverMoviesByFilter');
setupTestDB();

describe('Query: discoverMoviesByFilter', () => {
    let drama, action, romance;
    let sara, jen, jul;
    let director;
    let movieRom2010, movieRom2012, movieDrama2010, movieAction2012;
    let user;

    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Actor.destroy({ where: {}, truncate: true });
        await db.Genre.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });

        const role = await db.Role.create({ name: 'user' });
        user = await db.User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123',
            roleId: role.id
        });

        drama = await db.Genre.create({ name: 'Drama' });
        action = await db.Genre.create({ name: 'Action' });
        romance = await db.Genre.create({ name: 'Romance' });

        sara = await db.Actor.create({
            name: 'Sarah Jessica Parker',
            birthDate: '25-03-1965',
            nationality: 'American',
        });

        jen = await db.Actor.create({
            name: 'Jennifer Aniston',
            birthDate: '02-11-1969',
            nationality: 'American',
        });

        jul = await db.Actor.create({
            name: 'Julia Roberts',
            birthDate: '10-28-1967',
            nationality: 'American',
        });
        director = await db.Director.create({ name: 'Director' });

        movieRom2010 = await db.Movie.create({
            title: 'Holiday',
            description: 'Romance',
            releaseYear: '2010',
            directorId: director.id,
        });

        await db.MovieGenre.create({
            movieId: movieRom2010.id,
            genreId: romance.id,
        });

        await db.MovieActor.bulkCreate([
            {movieId: movieRom2010.id, actorId: sara.id},
            {movieId: movieRom2010.id, actorId: jen.id},
        ]);


        movieRom2012 = await db.Movie.create({
            title: 'Nothing hill',
            description: 'Romance',
            releaseYear: '2012',
            directorId: director.id,
        });
        await db.MovieGenre.create({
            movieId: movieRom2012.id,
            genreId: romance.id,
        });

        await db.MovieActor.bulkCreate([
            {movieId: movieRom2012.id, actorId: jul.id},
            {movieId: movieRom2012.id, actorId: jen.id},
        ]);


        movieDrama2010 = await db.Movie.create({
            title: 'Titanic',
            description: 'Drama',
            releaseYear: '2010',
            directorId: director.id,
        });

        await db.MovieGenre.create({
            movieId: movieDrama2010.id,
            genreId: drama.id,
        });

        await db.MovieActor.bulkCreate([
            {movieId: movieDrama2010.id, actorId: sara.id},
            {movieId: movieDrama2010.id, actorId: jul.id},
        ]);

        movieAction2012 = await db.Movie.create({
            title: 'Terminator',
            description: 'Action',
            releaseYear: '2012',
            directorId: director.id

        });

        await db.MovieGenre.create({
            movieId: movieAction2012.id,
            genreId: action.id,
        });

        await db.MovieActor.bulkCreate([
            {movieId: movieAction2012.id, actorId: jen.id},
            {movieId: movieAction2012.id, actorId: jul.id},
        ]);

    });

    const getContext = () => ({
        user: {
            id: user.id,
            userRole: { name: 'user'}
        }
    });
    

    describe('Happy path', () => {
        it('should filter movies by year', async () => {
            const args = {year: 2010};

            const res = await DiscoverMoviesByFilter.resolve(null, args, getContext());

            expect(res).toHaveLength(2);
            const titles = res.map(m => m.title);
            expect(titles).toContain('Holiday');
            expect(titles).toContain('Titanic');

        });

        it('should filter movies by gernreId', async () => {
            const args = {genreId: romance.id};

            const res = await DiscoverMoviesByFilter.resolve(null, args, getContext());

            expect(res).toHaveLength(2);

            const titles = res.map(m => m.title);
            expect(titles).toContain('Holiday');
            expect(titles).toContain('Nothing hill');
        });

        it('should filter movies by actorIds', async () => {
            const args = {actorId: jen.id};

            const res = await DiscoverMoviesByFilter.resolve(null, args, getContext());

            expect(res).toHaveLength(3);

            const titles = res.map(m => m.title);
            expect(titles).toContain('Holiday');
            expect(titles).toContain('Nothing hill');
            expect(titles).toContain('Terminator');
        });

        it('should return nothing', async () => {
            const args = {actorId: 999999};

            const res = await DiscoverMoviesByFilter.resolve(null, args, getContext());

            expect(res).toBeDefined();
            expect(res).toHaveLength(0);
            expect(Array.isArray(res)).toBe(true);
        });
    });

    describe('Sad path', () => {
        it('it should throw error if user is not authenticated', async () => {
            const context = {}
            const args = {year: 2010}
            await expect(DiscoverMoviesByFilter.resolve(null, args, context)).rejects.toThrow();
        })
    })
});