const { GraphQLList } = require('graphql');
const ActorPayload = require('../../types/ActorPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');

const Actors = {
    type: new GraphQLList(ActorPayload),
    resolve: async (_, args, context) => {
        checkAuth(context);
        return await db.Actor.findAll();
    }
}

module.exports = Actors;