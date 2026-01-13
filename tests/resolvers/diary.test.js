
const { setupTestDB, db } = require('../helper');
const DiaryQuery = require('../../graphql/queries/diary/diary');
const WatchList = require("../../graphql/queries/watchList/watchList");

setupTestDB();

describe('Query: Diary (Single)', () => {
  let owner, otherUser,admin, diary, m1, m2, r1, r2;

  beforeEach(async () => {
    await db.Diary.destroy({ where: {}, truncate: true });
    await db.Movie.destroy({ where: {}, truncate: true });
    await db.MovieDiary.destroy({ where: {}, truncate: true });
    await db.Review.destroy({ where: {}, truncate: true });

    const adminRole = await db.Role.create({ name: 'admin' });
    const userRole = await db.Role.create({ name: 'user' });

    owner = await db.User.create({ username: 'owner', email: 'owner@test.com', password: 'OwnerPa55!', roleId: userRole.id });
    otherUser = await db.User.create({ username: 'other', email: 'other@test.com', password: 'OtherPa55!', roleId: userRole.id });

    diary = await db.Diary.create({ userId: owner.id });

    m1 = await db.Movie.create({ title: 'Movie 1', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });
    m2 = await db.Movie.create({ title: 'Movie 2', releaseYear: 2025, createdAt: new Date(), updatedAt: new Date() });

    await db.MovieDiary.create({ movieId: m1.id, diaryId: diary.id, watchedAt: new Date('2025-01-01') });
    await db.MovieDiary.create({ movieId: m2.id, diaryId: diary.id, watchedAt: new Date('2025-01-01') });

    r1 = await db.Review.create({ userId: owner.id, movieId: m1.id, score: 8, content: 'Owner review' });
    r2 = await db.Review.create({ userId: otherUser.id, movieId: m1.id, score: 7, content: 'Other review' });
  });

  describe('Happy path', () => {
    it('should return diary with movies and reviews for admin', async () => {
      const context = { user: { id: 999, userRole: { name: 'admin' } } };

      const res = await DiaryQuery.resolve(null, { id: diary.id }, context);

      expect(res).toBeDefined();
      expect(res.id).toBe(diary.id);
      expect(res.userId).toBe(owner.id);
      expect(Array.isArray(res.movies)).toBe(true);
      expect(res.movies).toHaveLength(2);

      const movie1 = res.movies.find(m => m.id === m1.id);
      expect(movie1).toBeDefined();
      expect(movie1.watchedAt).toBeDefined();
      expect(Array.isArray(movie1.reviews)).toBe(true);

      // should include both reviews for movie1
      expect(movie1.reviews.length).toBe(2);

      // owner review should be available as `review`
      expect(movie1.review).toBeDefined();
      expect(movie1.review.userId).toBe(owner.id);
    });
  });

  describe('Sad path', () => {
    it('should throw error if one user try to view another user diary', async ()=>{
      const contex = {user: {id: otherUser.id, userRole: {name: 'user'}}};

      const args ={
        id: diary.id,
      }
      await expect(DiaryQuery.resolve(null, args, contex)).rejects.toThrow('Unauthorized: You need to be a admin to perform this action.');
    });

    it('should throw error if diary not found', async ()=>{
      const context = { user: { id: 999, userRole: { name: 'admin' } } };

      const args ={
        watchListId: 88888888898,
        movieId: diary.id,
      }
      await expect(DiaryQuery.resolve(null, args, context)).rejects.toThrow('Diary not found');
    });

    it('should throw error if user is missing', async ()=>{
      const contex = {}

      const args ={
        movieId: diary.id,
      }
      await expect(DiaryQuery.resolve(null, args, contex)).rejects.toThrow('Unauthentificated: Please log in');
    });
  });
});
