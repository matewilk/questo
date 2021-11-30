import express from "express";
import session from "express-session";
import passport from "passport";

import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";
import dotenv from "dotenv";

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

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req, res }) => {
      return {
        // user is added to req by passport.js
        // when deserialized properly
        user: req.user,
        req,
        res,
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

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
