const graphql = require('graphql');
const { GraphQLInt, GraphQLList } = graphql;
const DiaryPayload = require('../../types/DiaryPayload');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const Diaries = {
    type: new GraphQLList(DiaryPayload), 
    args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt }
    },
    async resolve(_, args, context) {
        checkRole(context, ['admin']);

        const page = args.page || 1;
        const limit = Math.min(args.limit || 10, 20); // Higher limit since we list users
        const offset = (page - 1) * limit;

        const diaries = await db.Diary.findAll({
            limit,
            offset,
            include: [{ model: db.User, as: 'user' }],
            order: [['createdAt', 'DESC']]
        });

        if (!diaries.length) return [];

        
        // We use Promise.all to run these small queries in parallel. (it should be faster)
        const diariesWithLogs = await Promise.all(diaries.map(async (diary) => {
            const recentLogs = await db.MovieDiary.findAll({
                where: { diaryId: diary.id },
                attributes: ['movieId', 'watchedAt'],
                order: [['watchedAt', 'DESC']],
                limit: 3, // Only show a preview of 3 items per diary
                raw: true
            });
            return { diary, recentLogs };
        }));

        // Aggregate all unique Movie IDs
        const allMovieIds = new Set();
        diariesWithLogs.forEach(({ recentLogs }) => {
            recentLogs.forEach(log => allMovieIds.add(log.movieId));
        });
        const uniqueMovieIds = Array.from(allMovieIds);

        // Batch Fetch Movies and Reviews
        const movies = uniqueMovieIds.length 
            ? await db.Movie.findAll({ where: { id: uniqueMovieIds } }) 
            : [];
        
        const allReviews = uniqueMovieIds.length 
            ? await db.Review.findAll({ 
                where: { movieId: uniqueMovieIds },
                include: [{ model: db.User, as: 'user' }]
              }) 
            : [];

        // Create Lookup Maps (O(1) Access)
        const movieMap = {};    // Contains movie details
        movies.forEach(m => { movieMap[m.id] = m; });

        const reviewsByMovie = {};  // Key: movieId -> Review
        const ownerReviewMap = {}; // Key: "movieId-userId" -> Review

        allReviews.forEach(r => {
            if (!reviewsByMovie[r.movieId]) {
                reviewsByMovie[r.movieId] = [];
            }
            reviewsByMovie[r.movieId].push(r);

            ownerReviewMap[`${r.movieId}-${r.userId}`] = r; 
        });


        return diariesWithLogs.map(({ diary, recentLogs }) => {

            /* 
                `diary.toJSON` is a pointer to the function `.toJSON()`
                it is used to check if the `diary` object has the function `.toJSON()`
                if the object does not have that function, it should already be a JSON
            */

            const d = diary.toJSON ? diary.toJSON() : diary;

            d.movies = recentLogs.map((row) => {
                const movie = movieMap[row.movieId];
                if (!movie){
                    return null;
                }

                const m = movie.toJSON ? movie.toJSON() : movie;

                m.watchedAt = row.watchedAt;
                m.reviews = reviewsByMovie[row.movieId] || [];
                m.review = ownerReviewMap[`${row.movieId}-${diary.userId}`] || null;
                
                return m;
            }).filter(m => m !== null);

            return d;
        });
    }
};

module.exports = Diaries;