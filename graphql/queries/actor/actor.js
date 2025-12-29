const {GraphQLInt, GraphQLError,} = require('graphql');
const ActorPayload = require('../../types/ActorPayload');
const db = require('../../../models');
const { checkAuth } = require('../../../utils/auth');
const {GraphQLNonNull} = require("graphql/type");
const Actors = require("./actors");

const Actor = {
    type: ActorPayload,
    args: {
        id: {
            type: GraphQLInt,
        },
    },

    resolve: async (parent, args, context) => {
        checkAuth(context);

        const { id } = args;

        const actor = await db.Actor.findByPk(id);

        if (!actor) {
            throw new GraphQLError("Not found");
        }

        return actor;
    }
}

module.exports = Actor;