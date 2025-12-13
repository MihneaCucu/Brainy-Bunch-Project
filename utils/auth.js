const { graphQLError, GraphQLError } = require('graphql');

const checkAuth = (context) => {
    if(!context.user){
        throw new GraphQLError('Unauthentificated: Please log in');
    }
};


const checkRole = (context, requiredRoles) => {
    checkAuth(context);

    const userRole = context.user.userRole.name;

    if(!requiredRoles.includes(userRole)) {
        throw new GraphQLError(`Unauthorized: You need to be a ${requiredRoles.join(' or ')} to perform this action.`)
    }
};

module.exports = { checkAuth, checkRole };