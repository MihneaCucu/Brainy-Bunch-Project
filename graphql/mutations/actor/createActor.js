const { GraphQLString, GraphQLNonNull } = require("graphql");
const ActorPayload = require('../../types/ActorPayload');
const CreateActorInput = require("../../inputTypes/actor/CreateActorInput");
const db = require("../../../models");
const { checkRole } = require('../../../utils/auth');
const {GraphQLObjectType} = require("graphql/type");

const CreateActor = {
    type: ActorPayload,
    args: {
        input: { type: new GraphQLNonNull(CreateActorInput)  },
    },

    resolve: async (_, args, context) => {
        checkRole(context, ['admin', 'moderator']);

        const actor = await db.Actor.create({
            name: args.input.name,
            birthDate: args.input.birthDate,
            nationality: args.input.nationality,
        });

        return actor;
    },
};
module.exports = CreateActor;