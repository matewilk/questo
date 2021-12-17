import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../graphql/schema";
import resolvers from "../graphql/resolvers";
import { ApolloServer } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { Server } from "http";
import { Express } from "express";
import QuestoSource from "../graphql/dataSource/questo";

export default async (
  app: Express,
  questoSource: QuestoSource,
  httpServer: Server,
  redisPubSub: any
) => {
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
        // subscription solution (with remote redis)
        pubSub: redisPubSub,
      };
    },
    dataSources: (): DataSources => {
      return {
        questoSource,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/api" });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(connectionParams, webSocket, context) {
        console.log("Connected!");
        // pass context to Apollo/GraphQL Subscription subscribe handler (with remote redis)
        return { ...context, pubSub: redisPubSub };
      },
      onDisconnect(webSocket, context) {
        console.log("Disconnected!");
      },
    },
    { server: httpServer, path: "/api" }
  );

  return server;
};
