// @ts-ignore
import { Server, WebSocket } from "mock-socket-with-protocol";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";

import { execute, subscribe } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "../../src/graphql/schema";
import resolvers from "../../src/graphql/resolvers";
import { PubSub } from "graphql-subscriptions";

export const gqClient = (pubSub: PubSub) => {
  // To make the point clear that we are not opening any ports here we use a randomized string that will not produce a correct port number.
  // This example of WebSocket client/server uses string matching to know to what server connect a given client.
  // We are randomizing because we should use different string for every test to not share state.
  const RANDOM_WS_PORT = Math.floor(Math.random() * 100000);
  const customServer = new Server(`ws://localhost:${RANDOM_WS_PORT}`);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // We pass customServer instead of typical configuration of a default WebSocket server
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(_, __, context) {
        return { ...context, pubSub };
      },
    },
    customServer
  );

  // The uri of the WebSocketLink has to match the customServer uri.
  const wsLink = new WebSocketLink({
    uri: `ws://localhost:${RANDOM_WS_PORT}`,
    webSocketImpl: WebSocket,
  });

  // Nothing new here
  return new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache(),
  });
};
