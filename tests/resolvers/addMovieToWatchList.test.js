const { setupTestDB, db } = require('../helper');
const AddMovieToWatchList = require('../../graphql/mutations/watchList/addMovieToWatchList.js');
const {args: userRole, user, watchList, movie} = require("../../graphql/queries/user/user");

setupTestDB();

describe('Mutation: addMovieToWatchList', () => {

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

    });

    describe('Happy Path', () => {
        it('should add movie to watch list', async ()=>{
            const contex = {user: {id: user1.id}}

            const args ={
                watchListId: watchList.id,
                movieId: movie.id,
            }

            const res = await AddMovieToWatchList.resolve(null, args,contex);

            expect(res.id).toBe(watchList.id);
            expect(res.movies).toBeDefined();


            if(!res.movies && res.movies.length > 0){
                expect(res.movies[0].id).toBe(movie.id);
            }

            const  entry = await db.WatchlistMovie.findOne({
                where: {
                    watchListId: watchList.id,
                    movieId: movie.id,
                }
            });
            expect(entry).not.toBeNull();
        });
    });

    describe('Sad Path', () => {
        it('should throw error if movie is in list', async ()=>{

            const contex = {user: {id: user1.id}}

            const args ={
                watchListId: watchList.id,
                movieId: movie.id,
            }

            await db.WatchlistMovie.create({
                watchlistId: watchList.id,
                movieId: movie.id,
            });

            await expect(AddMovieToWatchList.resolve(null, args, contex)).rejects.toThrow('Movie already exists in this list');
        });

        it('should throw error if one when the user does not have a watchlist', async ()=>{
            const contex = {user: {id: user2.id}}

            const args ={
                movieId: movie.id,
            }

            await expect(AddMovieToWatchList.resolve(null, args, contex)).rejects.toThrow('Watch list not found');
        });

        it('should throw error if movie not found', async ()=>{
            const contex = {user: {id: user1.id}}

            const args ={
                watchListId: watchList.id,
                movieId: 22222222333
            }

            await expect(AddMovieToWatchList.resolve(null, args, contex)).rejects.toThrow('Movie not found');
        });

        it('should throw error if watch list not found', async ()=>{
            const contex = {user: {id: user2.id}}

            const args ={
                watchListId: 88888888898,
                movieId: movie.id,
            }

            await expect(AddMovieToWatchList.resolve(null, args, contex)).rejects.toThrow('Watch list not found');
        });
    });
});