import { PubSub } from "graphql-subscriptions";

type Payload = {
  message: string;
};

export default {
  Subscription: {
    chat: {
      subscribe(
        _,
        { id }: { id: string },
        { pubSub }: { pubSub: PubSub }
      ): AsyncIterator<string> {
        return pubSub.asyncIterator(`CHAT_${id}`);
      },

      resolve: (payload: Payload) => {
        return {
          message: payload.message,
        };
      },
    },
  },

  Mutation: {
    sendMessage: async (
      _,
      { chatId, message }: { chatId: string; message: string },
      { pubSub }: { pubSub: PubSub }
    ) => {
      await pubSub.publish(`CHAT_${chatId}`, { message });
      return {
        message,
      };
    },
  },
};
