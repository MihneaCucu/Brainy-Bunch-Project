const { setupTestDB, db } = require('../helper');
const Diaries = require('../../graphql/queries/diary/diaries');
const WatchLists = require("../../graphql/queries/watchList/watchLists");

setupTestDB();

describe('Query: Diaries (List)', () => {
    beforeEach(async () => {
        await db.Diary.destroy({ where: {}, truncate: true });
        await db.Movie.destroy({ where: {}, truncate: true });
        await db.MovieDiary.destroy({ where: {}, truncate: true });
        await db.Review.destroy({ where: {}, truncate: true });
        await db.User.destroy({ where: {}, truncate: true });
        await db.Role.destroy({ where: {}, truncate: true });
    });
    describe('Happy path', () => {

        it('should return empty array when none exist', async () => {
            const context = { user: { id: 1, userRole: { name: 'admin' } } };

            const res = await Diaries.resolve(null, {}, context);

            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });

        it('should list diaries with movies and review previews', async () => {
            const adminRole = await db.Role.create({ name: 'admin' });
            const userRole = await db.Role.create({ name: 'user' });

            const u1 = await db.User.create({ username: 'u1', email: 'u1@test.com', password: 'P1Pa55!', roleId: userRole.id });
            const u2 = await db.User.create({ username: 'u2', email: 'u2@test.com', password: 'P2Pa55!', roleId: userRole.id });
            const u3 = await db.User.create({ username: 'u3', email: 'u3@test.com', password: 'P3Pa55!', roleId: userRole.id });

            const d1 = await db.Diary.create({ userId: u1.id });
            const d2 = await db.Diary.create({ userId: u2.id });

            const m1 = await db.Movie.create({ title: 'M1', releaseYear: 2020, createdAt: new Date(), updatedAt: new Date() });
            const m2 = await db.Movie.create({ title: 'M2', releaseYear: 2021, createdAt: new Date(), updatedAt: new Date() });
            const m3 = await db.Movie.create({ title: 'M3', releaseYear: 2022, createdAt: new Date(), updatedAt: new Date() });
            const m4 = await db.Movie.create({ title: 'M4', releaseYear: 2023, createdAt: new Date(), updatedAt: new Date() });

            // attach movies to diaries (d1 has 3, d2 has 1)
            await db.MovieDiary.create({ movieId: m1.id, diaryId: d1.id, watchedAt: new Date('2025-01-01') });
            await db.MovieDiary.create({ movieId: m2.id, diaryId: d1.id, watchedAt: new Date('2025-02-01') });
            await db.MovieDiary.create({ movieId: m3.id, diaryId: d1.id, watchedAt: new Date('2025-03-01') });
            await db.MovieDiary.create({ movieId: m4.id, diaryId: d2.id, watchedAt: new Date('2025-04-01') });

            // reviews for movies (owner and others)
            await db.Review.create({ userId: u1.id, movieId: m1.id, score: 7, content: 'u1 review m1' });
            await db.Review.create({ userId: u2.id, movieId: m1.id, score: 8, content: 'u2 review m1' });
            await db.Review.create({ userId: u3.id, movieId: m2.id, score: 9, content: 'u3 review m2' });

            const context = { user: { id: 999, userRole: { name: 'admin' } } };

            const res = await Diaries.resolve(null, { page: 1, limit: 10 }, context);
            expect(Array.isArray(res)).toBe(true);

            expect(res.length).toBe(2);

            const firstDiary = res.find(d => d.userId === u1.id);
            expect(firstDiary).toBeDefined();
            expect(Array.isArray(firstDiary.movies)).toBe(true);

            // only recentLogs limit 3, so d1 should show 3 movies
            expect(firstDiary.movies.length).toBe(3);

            const movie1 = firstDiary.movies.find(m => m.id === m1.id);
            expect(movie1).toBeDefined();
            expect(movie1.watchedAt).toBeDefined();
            expect(Array.isArray(movie1.reviews)).toBe(true);

            // movie1 should have 2 reviews
            expect(movie1.reviews.length).toBe(2);

            // owner review mapping for u1
            expect(movie1.review).toBeDefined();
            expect(movie1.review.userId).toBe(u1.id);
        });

        it('should support pagination via limit', async () => {
            const userRole = await db.Role.create({ name: 'user' });
            const a = await db.User.create({ username: 'a', email: 'a@test.com', password: 'APa55!', roleId: userRole.id });

            // create 3 diaries
            await db.Diary.create({ userId: a.id });
            const b = await db.User.create({ username: 'b', email: 'b@test.com', password: 'BPa55!', roleId: userRole.id });
            await db.Diary.create({ userId: b.id });
            const c = await db.User.create({ username: 'c', email: 'c@test.com', password: 'CPa55!', roleId: userRole.id });
            await db.Diary.create({ userId: c.id });

            const context = { user: { id: 1, userRole: { name: 'admin' } } };
            const res = await Diaries.resolve(null, { page: 1, limit: 1 }, context);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1);
        });

    });

    describe('Sad Path', () => {
        let userRole, user1;
        it('it should throw error if a user tries to acces the lists ', async () => {
            userRole = await db.Role.create({ name: 'user' });
            user1 = await db.User.create({
                username: 'user1',
                email: 'user1@test.com',
                password: 'Pass123!',
                roleId: userRole.id
            });
            const contex = {user: {id: user1.id, userRole: {name: 'user'}}};
            const args ={page: 1};
            await expect(Diaries.resolve(null, args, contex)).rejects.toThrow();
        });
        it('it should throw error if a user is missing ', async () => {
            const contex = {};
            const args ={page: 1};
            await expect(Diaries.resolve(null, args, contex)).rejects.toThrow();
        });

    })
});
