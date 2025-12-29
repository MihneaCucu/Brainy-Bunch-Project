const { GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');
const ActorPayload = require('../../types/ActorPayload');
const UpdateActorInput = require('../../inputTypes/actor/UpdateActorInput');
const db = require('../../../models');
const { checkRole } = require('../../../utils/auth');

const updateActor = {
    type: ActorPayload,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        input: {type: new GraphQLNonNull(UpdateActorInput)},
    },

    resolve: async (parent, args, context) => {
        checkRole(context, ['admin']);

        const actor = await db.Actor.findByPk(args.id);
        if (!actor) {
            throw new Error("Actor not found");
        }

        const {input} = args;

        if (!input.name !== undefined) {
            actor.name = input.name;
        }

        if (!input.birthDate !== undefined) {
            actor.birthDate = input.birthDate;
        }

        if (!input.nationality !== undefined) {
            actor.nationality = input.nationality;
        }

        await actor.save();

        return await db.Actor.findByPk(actor.id);
    }
};

module.exports = updateActor;