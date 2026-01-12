const {GraphQLString, GraphQLError} = require('graphql');
const ActorPayload = require('../../types/ActorPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');
const Actors = require("./actors");

const Actor = {
    type: ActorPayload,
    args: {
        name: {
            type: GraphQLString,
        },
    },

    resolve: async (parent, args, context) => {
        checkAuth(context);

        const { name } = args;

        const actor = await db.Actor.findOne({ where: { name } });

        if (!actor) {
            throw new GraphQLError("Not found");
        }

        return actor;
    }
}

module.exports = Actor;