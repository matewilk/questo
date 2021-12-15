import express from "express";
import passport from "passport";
import Redis from "ioredis";
import dotenv from "dotenv";
import { RedisPubSub } from "graphql-redis-subscriptions";

import apolloConfig from "./helpers/apollo";
import QuestoSource from "./graphql/dataSource/questo";
import { passportConfig } from "./helpers/passport-authentication";
import expressSessionRedis from "./helpers/express-session-redis";
import setHttpServer from "./helpers/httpServer";

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
  // ** express app setup **
  const app = express();
  app.use(express.json());
  // healthcheck for k8s/eks/aws/target group
  app.get("/health", (req, res) => {
    res.status(200).send("service is healthy");
  });
  // Redis options for both PubSub (graphql subscriptions) and express-session
  const redisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
  };
  // setup Redis PubSub (graphql subscriptions) bus
  const redisPubSub = new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
  });
  // setup authentication (express-session)
  const questoSource = new QuestoSource();
  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig(questoSource);
  // setup redis (for express-session)
  expressSessionRedis(app, redisOptions);

  // ** http(s) server setup **
  const httpServer = setHttpServer(app);
  // setup Apollo Server (with redis as pubsub bus)
  const server = await apolloConfig(app, questoSource, httpServer, redisPubSub);
  //start http(s) server
  const PORT = 4000;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(
    `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer();
