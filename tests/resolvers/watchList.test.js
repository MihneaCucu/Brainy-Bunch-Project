const { setupTestDB, db } = require('../helper');
const WatchList = require('../../graphql/queries/watchList/watchList');
setupTestDB();

describe('Query: watchList', () => {

    let userRole, user1, user2;
    let director, movie, watchList;

    beforeEach(async () => {
        await db.WatchlistMovie.destroy({ where: {}, truncate: true });
        await db.Watchlist.destroy({ where: {}, truncate: true });
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Director.destroy({ where: {}, truncate: true });

        userRole = await db.Role.create({ name: 'user' });

        user1 = await db.User.create({
            username: 'user1',
            email: 'user1@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        user2 = await db.User.create({
            username: 'user2',
            email: 'user2@test.com',
            password: 'Pass123!',
            roleId: userRole.id
        });

        director = await db.Director.create({ name: 'Director' });

        movie = await db.Movie.create({
            title: 'Holiday',
            description: 'Romance',
            releaseYear: '2010',
            directorId: director.id,
        });

        watchList = await db.Watchlist.create({
            name: 'My list',
            description: 'best movies',
            userId: user1.id,
        });

        await db.WatchlistMovie.create({
            watchlistId: watchList.id,
            movieId: movie.id,
        });

    });

    it('should return watchlist with movies if user is owner', async () => {
        const contex = {user: {id: user1.id, userRole: {name: 'user'}}};

        const args ={
            id: watchList.id,
        }

        const res = await WatchList.resolve(null, args, contex);

        expect(res.id).toBe(watchList.id);
        expect(res.name).toBe('My list');
        expect(res.movies).toBeDefined();
        expect(res.movies.length).toBeGreaterThan(0);
        expect(res.movies[0].title).toBe('Holiday');
    });

    it('should throw error if one user try to view another user watch list', async ()=>{
        const contex = {user: {id: user2.id, userRole: {name: 'user'}}};

        const args ={
            id: watchList.id,
        }

        await expect(WatchList.resolve(null, args, contex)).rejects.toThrow('You do not have permission to view this list');
    });

    it('should throw error if watch list not found', async ()=>{
        const contex = {user: {id: user1.id}}

        const args ={
            watchListId: 88888888898,
            movieId: movie.id,
        }

        await expect(WatchList.resolve(null, args, contex)).rejects.toThrow('Watch list not found');
    });

});
