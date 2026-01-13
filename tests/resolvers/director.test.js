const { setupTestDB, db } = require('../helper');
const Director = require('../../graphql/queries/director/director');

setupTestDB();

describe('Query: director (Single)', () => {
    let userRole, user;
    let director1, director2;

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

        // Create directors
        director1 = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
        });

        director2 = await db.Director.create({
            name: 'Quentin Tarantino',
            birthDate: '1963-03-27',
            nationality: 'American'
        });
    });

    // HAPPY PATHS
    it('should return director by name', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input: {
                name: director1.name
            }
        };

        const result = await Director.resolve(null, args, context);

        expect(result).toBeDefined();
        expect(result.id).toBe(director1.id);
        expect(result.name).toBe('Christopher Nolan');
        expect(result.birthDate).toBe('1970-07-30');
        expect(result.nationality).toBe('British-American');
    });

    it('should return director with all fields', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input:{
                name: director2.name
            }
        };

        const result = await Director.resolve(null, args, context);

        expect(result.id).toBe(director2.id);
        expect(result.name).toBe('Quentin Tarantino');
        expect(result.birthDate).toBe('1963-03-27');
        expect(result.nationality).toBe('American');
    });

    it('should return director with movies included', async () => {
        // Create movies for director
        await db.Movie.create({
            title: 'Inception',
            releaseYear: 2010,
            directorId: director1.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await db.Movie.create({
            title: 'The Dark Knight',
            releaseYear: 2008,
            directorId: director1.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await db.Movie.create({
            title: 'Interstellar',
            releaseYear: 2014,
            directorId: director1.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input:{
                name: director1.name
            }
        };

        const result = await Director.resolve(null, args, context);

        expect(result.movies).toBeDefined();
        expect(Array.isArray(result.movies)).toBe(true);
        expect(result.movies.length).toBe(3);

        const movieTitles = result.movies.map(m => m.title);
        expect(movieTitles).toContain('Inception');
        expect(movieTitles).toContain('The Dark Knight');
        expect(movieTitles).toContain('Interstellar');
    });

    it('should return director with empty movies array if no movies', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input:{
                name: director1.name
            }
        };

        const result = await Director.resolve(null, args, context);

        expect(result.movies).toBeDefined();
        expect(Array.isArray(result.movies)).toBe(true);
        expect(result.movies.length).toBe(0);
    });

    it('should return director with movie details', async () => {
        // Create a movie with full details
        await db.Movie.create({
            title: 'Inception',
            releaseYear: 2010,
            directorId: director1.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input:{
                name: director1.name
            }
        };

        const result = await Director.resolve(null, args, context);

        expect(result.movies.length).toBe(1);
        expect(result.movies[0].title).toBe('Inception');
        expect(result.movies[0].releaseYear).toBe(2010);
        expect(result.movies[0].directorId).toBe(director1.id);
    });

    // SAD PATHS
    it('should FAIL when director does not exist', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            input:{
                name: "Regizor Inexistent"
            }
        };

        await expect(Director.resolve(null, args, context))
            .rejects
            .toThrow('Director not found');
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: director1.id
        };

        await expect(Director.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should FAIL when id is null', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: null
        };

        await expect(Director.resolve(null, args, context))
            .rejects
            .toThrow();
    });

});

