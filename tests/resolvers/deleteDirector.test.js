const { setupTestDB, db } = require('../helper');
const DeleteDirector = require('../../graphql/mutations/director/deleteDirector');

setupTestDB();

describe('Mutation: deleteDirector', () => {
    let adminRole, moderatorRole, userRole, admin, moderator, user;
    let director1, director2, directorWithMovies;

    beforeEach(async () => {
        // Create roles
        adminRole = await db.Role.create({ name: 'admin' });
        moderatorRole = await db.Role.create({ name: 'moderator' });
        userRole = await db.Role.create({ name: 'user' });

        // Create users
        admin = await db.User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Pass123!',
            roleId: adminRole.id
        });

        moderator = await db.User.create({
            username: 'moderator',
            email: 'mod@test.com',
            password: 'Pass123!',
            roleId: moderatorRole.id
        });

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

        directorWithMovies = await db.Director.create({
            name: 'Steven Spielberg',
            birthDate: '1946-12-18',
            nationality: 'American'
        });

        // Create movies for directorWithMovies
        await db.Movie.create({
            title: 'Jurassic Park',
            releaseYear: 1993,
            directorId: directorWithMovies.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await db.Movie.create({
            title: 'Schindlers List',
            releaseYear: 1993,
            directorId: directorWithMovies.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });

    // HAPPY PATHS
    it('should delete director when admin', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id
        };

        const result = await DeleteDirector.resolve(null, args, context);

        expect(result).toBe('Director deleted successfully');

        // Verify director is deleted from database
        const deletedDirector = await db.Director.findByPk(director1.id);
        expect(deletedDirector).toBeNull();
    });

    it('should verify director is removed from database after deletion', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        // Verify director exists before deletion
        let directorExists = await db.Director.findByPk(director1.id);
        expect(directorExists).not.toBeNull();

        const args = {
            id: director1.id
        };

        await DeleteDirector.resolve(null, args, context);

        // Verify director no longer exists
        directorExists = await db.Director.findByPk(director1.id);
        expect(directorExists).toBeNull();
    });

    it('should not affect other directors when deleting one', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: director1.id
        };

        await DeleteDirector.resolve(null, args, context);

        // Verify director2 still exists
        const director2StillExists = await db.Director.findByPk(director2.id);
        expect(director2StillExists).not.toBeNull();
        expect(director2StillExists.name).toBe('Quentin Tarantino');
    });

    // SAD PATHS
    it('should FAIL when director does not exist', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: 99999
        };

        await expect(DeleteDirector.resolve(null, args, context))
            .rejects
            .toThrow('Director not found');
    });

    it('should FAIL when moderator tries to delete director', async () => {
        const context = {
            user: {
                id: moderator.id,
                userRole: { name: 'moderator' }
            }
        };

        const args = {
            id: director1.id
        };

        await expect(DeleteDirector.resolve(null, args, context))
            .rejects
            .toThrow();

        // Verify director still exists
        const directorStillExists = await db.Director.findByPk(director1.id);
        expect(directorStillExists).not.toBeNull();
    });

    it('should FAIL when regular user tries to delete director', async () => {
        const context = {
            user: {
                id: user.id,
                userRole: { name: 'user' }
            }
        };

        const args = {
            id: director1.id
        };

        await expect(DeleteDirector.resolve(null, args, context))
            .rejects
            .toThrow();

        // Verify director still exists
        const directorStillExists = await db.Director.findByPk(director1.id);
        expect(directorStillExists).not.toBeNull();
    });

    it('should FAIL when user is not authenticated', async () => {
        const context = {}; // No user

        const args = {
            id: director1.id
        };

        await expect(DeleteDirector.resolve(null, args, context))
            .rejects
            .toThrow();
    });

    it('should FAIL when director has associated movies', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: directorWithMovies.id
        };

        await expect(DeleteDirector.resolve(null, args, context))
            .rejects
            .toThrow('Cannot delete director. They have 2 movie(s) associated.');

        // Verify director still exists
        const directorStillExists = await db.Director.findByPk(directorWithMovies.id);
        expect(directorStillExists).not.toBeNull();
    });

    it('should FAIL when director has even one associated movie', async () => {
        // Create director with only one movie
        const directorWithOneMovie = await db.Director.create({
            name: 'Denis Villeneuve',
            birthDate: '1967-10-03',
            nationality: 'Canadian'
        });

        await db.Movie.create({
            title: 'Dune',
            releaseYear: 2021,
            directorId: directorWithOneMovie.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        const args = {
            id: directorWithOneMovie.id
        };

        await expect(DeleteDirector.resolve(null, args, context))
            .rejects
            .toThrow('Cannot delete director. They have 1 movie(s) associated.');
    });

    it('should allow deletion after movies are removed', async () => {
        const context = {
            user: {
                id: admin.id,
                userRole: { name: 'admin' }
            }
        };

        // First, verify deletion fails with movies
        await expect(DeleteDirector.resolve(null, { id: directorWithMovies.id }, context))
            .rejects
            .toThrow('Cannot delete director. They have 2 movie(s) associated.');

        // Remove all movies
        await db.Movie.destroy({
            where: { directorId: directorWithMovies.id }
        });

        // Now deletion should succeed
        const result = await DeleteDirector.resolve(null, { id: directorWithMovies.id }, context);

        expect(result).toBe('Director deleted successfully');

        const deletedDirector = await db.Director.findByPk(directorWithMovies.id);
        expect(deletedDirector).toBeNull();
    });
});

