const { setupTestDB, db } = require('../helper');
const Directors = require('../../graphql/queries/director/directors');

setupTestDB();

describe('Query: directors (List)', () => {
    let userRole, user;

    beforeEach(async () => {
        // Create role
        userRole = await db.Role.create({ name: 'user' });

        // Create user
        user = await db.User.create({
            username: 'user',
            email: 'user@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });
    });

    // HAPPY PATHS
    it('should return empty array when no directors exist', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const result = await Directors.resolve(null, {}, context);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return all directors', async () => {
        // Create directors
        await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });

        await db.Director.create({
            name: 'Quentin Tarantino',
            birthDate: '1963-03-27',
            nationality: 'American'
        });

        await db.Director.create({
            name: 'Steven Spielberg',
            birthDate: '1946-12-18',
            nationality: 'American'
        });

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const result = await Directors.resolve(null, {}, context);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3);
    });

    it('should return directors with correct data', async () => {
        await db.Director.create({
            name: 'Denis Villeneuve',
            birthDate: '1967-10-03',
            nationality: 'Canadian'
        });

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const result = await Directors.resolve(null, {}, context);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('Denis Villeneuve');
        expect(result[0].birthDate).toBe('1967-10-03');
        expect(result[0].nationality).toBe('Canadian');
    });

    it('should include movies in director results', async () => {
        const director = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });

        // Create movies for director
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

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const result = await Directors.resolve(null, {}, context);

        expect(result.length).toBe(1);
        expect(result[0].movies).toBeDefined();
        expect(Array.isArray(result[0].movies)).toBe(true);
        expect(result[0].movies.length).toBe(2);

        const movieTitles = result[0].movies.map(m => m.title);
        expect(movieTitles).toContain('Inception');
        expect(movieTitles).toContain('The Dark Knight');
    });

    it('should return directors with empty movies array if no movies', async () => {
        await db.Director.create({
            name: 'New Director',
            birthDate: '1990-01-01',
            nationality: 'Unknown'
        });

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const result = await Directors.resolve(null, {}, context);

        expect(result.length).toBe(1);
        expect(result[0].movies).toBeDefined();
        expect(Array.isArray(result[0].movies)).toBe(true);
        expect(result[0].movies.length).toBe(0);
    });

    it('should return multiple directors with their movies', async () => {
        const director1 = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });

        const director2 = await db.Director.create({
            name: 'Quentin Tarantino',
            birthDate: '1963-03-27',
            nationality: 'American'
        });

        // Movies for director1
        await db.Movie.create({
            title: 'Inception',
            releaseYear: 2010,
            directorId: director1.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Movies for director2
        await db.Movie.create({
            title: 'Pulp Fiction',
            releaseYear: 1994,
            directorId: director2.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await db.Movie.create({
            title: 'Django Unchained',
            releaseYear: 2012,
            directorId: director2.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const result = await Directors.resolve(null, {}, context);

        expect(result.length).toBe(2);

        const nolan = result.find(d => d.name === 'Christopher Nolan');
        const tarantino = result.find(d => d.name === 'Quentin Tarantino');

        expect(nolan.movies.length).toBe(1);
        expect(tarantino.movies.length).toBe(2);
    });

    it('should return directors with partial information', async () => {
        await db.Director.create({
            name: 'Unknown Director'
            // No birthDate or nationality
        });

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const result = await Directors.resolve(null, {}, context);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('Unknown Director');
        expect(result[0].birthDate).toBeNull();
        expect(result[0].nationality).toBeNull();
    });

    // SAD PATH
    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        await expect(Directors.resolve(null, {}, context))
            .rejects
            .toThrow();
    });
});

