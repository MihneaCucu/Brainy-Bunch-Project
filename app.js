const express = require('express');
require('dotenv').config();

const depthLimit = require('graphql-depth-limit');
const app = express();

const port = process.env.PORT || 3000;

const { createHandler } = require('graphql-http/lib/use/http');
const { 
    GraphQLSchema, 
} = require('graphql');


const QueryType = require('./graphql/rootType/queryType');
const MutationType = require('./graphql/rootType/MutationType');
const jwtMiddleware = require("./middlewares/jwtMiddleware");

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

const graphQLHandler = createHandler({
    schema,
    validationRules: [depthLimit(5)],
    context: (req) => {
        return {
            // the user data might be on 'req.userData' or 'req.raw.userData'
            user: req.raw && req.raw.userData ? req.raw.userData : req.userData,
        }
    }
});

app.post('/graphql', jwtMiddleware, graphQLHandler);

module.exports = {
    app,
    port,
};