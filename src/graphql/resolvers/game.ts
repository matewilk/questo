import { PubSub } from "graphql-subscriptions";

type Payload = {
  key: string;
};

export default {
  Subscription: {
    game: {
      subscribe(
        _,
        { id }: { id: string },
        { pubSub }: { pubSub: PubSub }
      ): AsyncIterator<string> {
        return pubSub.asyncIterator(`GAME_${id}`);
      },

      resolve: ({ key }: Payload) => {
        return { key };
      },
    },
  },

  Mutation: {
    keyPress: async (
      _,
      { gameId, key }: { gameId: string; key: string },
      { pubSub }: { pubSub: PubSub }
    ) => {
      await pubSub.publish(`GAME_${gameId}`, { key });
      return { key };
    },
  },
};
