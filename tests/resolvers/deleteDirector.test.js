const { setupTestDB, db } = require('../helper');
const DeleteDirector = require('../../graphql/mutations/director/deleteDirector');

setupTestDB();

describe('Mutation: deleteDirector', () => {
    let admin;
    let director;
    let directorWithMovies;

    beforeEach(async () => {
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });

        const adminRole = await db.Role.create({ name: 'admin' });

        admin = await db.User.create({
            username: 'admin',
            email: 'admin@test.com',
            password: 'Pass123!',
            roleId: adminRole.id
        });

        director = await db.Director.create({
            name: 'Christopher Nolan',
            birthDate: '1970-07-30',
            nationality: 'British-American'
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

    describe('Happy Path', () => {
        it('should delete director when user is admin', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };

            const result = await DeleteDirector.resolve(null, { id: director.id }, context);

            expect(result).toBe('Director deleted successfully');

            const deletedDirector = await db.Director.findByPk(director.id);
            expect(deletedDirector).toBeNull();
        });
    });

    describe('Sad Path', () => {
        it('should throw an error when director does not exist', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };

            await expect(DeleteDirector.resolve(null, { id: 9999 }, context))
                .rejects
                .toThrow('Director not found');
        });

        it('should throw an error when user is not admin', async () => {
            const userRole = await db.Role.create({ name: 'user' });
            const regularUser = await db.User.create({
                username: 'user',
                email: 'user@test.com',
                password: 'Pass123!',
                roleId: userRole.id
            });

            const context = { user: { id: regularUser.id, userRole: { name: 'user' } } };

            await expect(DeleteDirector.resolve(null, { id: director.id }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when user is not authenticated', async () => {
            const context = {};

            await expect(DeleteDirector.resolve(null, { id: director.id }, context))
                .rejects
                .toThrow();
        });

        it('should throw an error when director has associated movies', async () => {
            const context = { user: { id: admin.id, userRole: { name: 'admin' } } };

            await expect(DeleteDirector.resolve(null, { id: directorWithMovies.id }, context))
                .rejects
                .toThrow('Cannot delete director. They have 2 movie(s) associated.');
        });
    });
});

