import express from "express";
import session from "express-session";
import passport from "passport";

import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/schema";
import dotenv from "dotenv";

import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";

import resolvers from "./graphql/resolvers";
import QuestoSource from "./graphql/dataSource/questo";
import { passportConfig } from "./helpers/passport-authentication";

dotenv.config();

/**
 types: question, question:answer, question:user
 given a question find all answers

 GSI reverse lookup: for example PK user, SK question
 given a user find all questions (and answers??)

 Simple lookup: PK
 One to many relationship: PK and SK
 Many to many relationship: PK&SK and one or more GSI
 **/

async function startApolloServer() {
  const questoSource = new QuestoSource();
  const app = express();
  const httpServer = createServer(app);
  const pubSub = new PubSub();
  // body parse middleware
  app.use(express.json());

  // healthcheck for k8s/eks/aws/target group
  app.get("/health", (req, res) => {
    res.status(200).send("service is healthy");
  });

  app.use(
    session({
      name: "questo.sess",
      secret: process.env.COOKIE_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.ENVIRONMENT === "production",
        httpOnly: false,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig(questoSource);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async ServerWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: ({ req, res }) => {
      return {
        // user is added to req by passport.js
        // when deserialized properly
        user: req.user,
        req,
        res,
        // subscription solution
        pubSub,
      };
    },
    dataSources: (): DataSources => {
      return {
        questoSource,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/" });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(connectionParams, webSocket, context) {
        console.log("Connected!");
        return { pubSub };
      },
      onDisconnect(webSocket, context) {
        console.log("Disconnected!");
      },
    },
    { server: httpServer, path: "/" }
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
