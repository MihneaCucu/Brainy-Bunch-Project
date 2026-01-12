const { GraphQLNonNull} = require('graphql');
const CommentPayload = require('../../types/CommentPayload');
const db = require('../../../models');
const CreateCommentInput = require("../../inputTypes/comment/CreateCommentInput");
const {checkRole} = require("../../../utils/auth");

const CreateComment = {
    type: CommentPayload,
    args: {
       input:{
           type: new GraphQLNonNull(CreateCommentInput),
       }
    },

    resolve: async (_, args, context) => {
        checkRole(context, ['user', 'moderator', 'admin']);

        if (!args.input.content.trim()) {
            throw new Error("Content cannot be empty");
        }

        const review = await db.Review.findByPk(args.input.reviewId);
        if (!review) {
            throw new Error("Review not found");
        }


        const now = new Date();

        const comment = await db.Comment.create({
            reviewId: args.input.reviewId,
            content: args.input.content,
            userId: context.user.id,
            createdAt: now,
            updatedAt: now,
        });

        return await db.Comment.findByPk(comment.id, {
            include: [
                {model: db.User, as: 'user'},
                {model: db.Review, as: 'review'}
            ],
        });
    },
};

module.exports = CreateComment;