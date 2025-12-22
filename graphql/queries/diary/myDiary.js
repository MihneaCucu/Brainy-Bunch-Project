const graphql = require('graphql');
const { GraphQLNonNull, GraphQLInt } = graphql;
const DiaryPayload = require('../../types/DiaryPayload');
const db = require('../../../models');

const MyDiary = {
    type: DiaryPayload,
    args: {},
    async resolve(parent, args, context) {
        if (!context.user) {
            throw new Error("You must be logged in to view your diary");
        }

        let diary = await db.Diary.findOne({ where: { userId: context.user.id } });
        if (!diary) {
            diary = await db.Diary.create({ userId: context.user.id });
        }

        // attach movies later via DiaryPayload resolver
        return diary;
    }
};

module.exports = MyDiary;
