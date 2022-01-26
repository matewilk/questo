export default {
  Subscription: {
    chat: {
      subscribe(_, { id }, { pubSub }) {
        return pubSub.asyncIterator(`CHAT_${id}`);
      },
      resolve: (payload) => {
        return {
          message: payload.message,
        };
      },
    },
  },

  Mutation: {
    sendMessage: async (_, { chatId, message }, { pubSub }) => {
      pubSub.publish(`CHAT_${chatId}`, { message });
      return {
        message,
      };
    },
  },
};
