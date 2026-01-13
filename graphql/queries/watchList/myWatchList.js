const WatchListPayload = require('../../types/WatchListPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const MyWatchList = {
    type: WatchListPayload,
    args: {},
    async resolve(parent, args, context) {
        checkAuth(context);

        let watchList = await db.Watchlist.findOne({
            where: { userId: context.user.id },
            include: [
                { model: db.User, as: 'user' },
                {
                    model: db.Movie,
                    as: 'movies',
                    include: [
                        { model: db.Director, as: 'director' },
                        { model: db.Actor, as: 'actors' },
                        { model: db.Genre, as: 'genres' }
                    ]
                }
            ]
        });

        if (!watchList) {
            watchList = await db.Watchlist.create({
                userId: context.user.id,
                name: 'My Watchlist',
                description: 'Movies I want to watch'
            });
        }

        return watchList;
    }
};

module.exports = MyWatchList;

