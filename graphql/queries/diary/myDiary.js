const graphql = require('graphql');
const { GraphQLNonNull, GraphQLInt } = graphql;
const DiaryPayload = require('../../types/DiaryPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const MyDiary = {
    type: DiaryPayload,
    args: {},
    async resolve(parent, args, context) {
        checkAuth(context);

        let diary = await db.Diary.findOne({ where: { userId: context.user.id } });
        if (!diary) {
            diary = await db.Diary.create({ userId: context.user.id });
        }

        // attach movies later via DiaryPayload resolver
        return diary;
    }
};

module.exports = MyDiary;
