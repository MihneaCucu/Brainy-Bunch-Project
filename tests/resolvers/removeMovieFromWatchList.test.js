const { setupTestDB, db } = require('../helper');
const RemoveMovieFromWatchList = require('../../graphql/mutations/watchList/removeMovieFromWatchList.js');
const AddMovieToWatchList = require("../../graphql/mutations/watchList/addMovieToWatchList");

setupTestDB();

describe('Muation: removeMovieFromWatchList', () => {

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
            name: 'My list ',
            description: 'best movies',
            userId: user1.id,
        });

        await db.WatchlistMovie.create({
            watchlistId: watchList.id,
            movieId: movie.id,
        });

    });

    it('it should remove movie from watchlist', async () => {
        const contex = {user: {id: user1.id}}

        const args ={
            watchListId: watchList.id,
            movieId: movie.id,
        }


        const beforedelete = await db.WatchlistMovie.findOne({
            where: {
                watchListId: watchList.id,
                movieId: movie.id,
            }
        });

        expect(beforedelete).not.toBeNull();

        const res = await RemoveMovieFromWatchList.resolve(null, args, contex);

        expect(res.id).toBe(watchList.id);

        const afterDelete = await db.WatchlistMovie.findOne({
            where: {
                watchListId: watchList.id,
                movieId: movie.id,
            }
        });

        expect(afterDelete).toBeNull();

    });

    it('should throw error if one user try to remove from another user watch list', async ()=>{
        const contex = {user: {id: user2.id}}

        const args ={
            watchListId: watchList.id,
            movieId: movie.id,
        }

        await expect(RemoveMovieFromWatchList.resolve(null, args, contex)).rejects.toThrow('You can only update your own watch lists');
    });

    it('should throw error if movie not found in the watchlist', async ()=>{
        await db.WatchlistMovie.destroy({ where: {}, truncate: true });

        const contex = {user: {id: user1.id}}

        const args ={
            watchListId: watchList.id,
            movieId: 22222222333
        }

        await expect(RemoveMovieFromWatchList.resolve(null, args, contex)).rejects.toThrow('Movie not found in this list');
    });

    it('should throw error if if watch list not found', async ()=>{
        const contex = {user: {id: user2.id}}

        const args ={
            watchListId: 88888888898,
            movieId: movie.id,
        }

        await expect(AddMovieToWatchList.resolve(null, args, contex)).rejects.toThrow('Watch list not found');
    });

});
