import express from "express";
import passport from "passport";
import Redis from "ioredis";
import dotenv from "dotenv";

import { createServer } from "http";
import { RedisPubSub } from "graphql-redis-subscriptions";

import apolloConfig from "./helpers/apollo"
import QuestoSource from "./graphql/dataSource/questo";
import { passportConfig } from "./helpers/passport-authentication";
import expressSessionRedis from "./helpers/express-session-redis";

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

  // body parse middleware
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

  // setup express-session (with redis)
  expressSessionRedis(app, redisOptions);

  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig(questoSource);

  const server = await apolloConfig(app, httpServer, redisPubSub)

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
