export default {
  Subscription: {
    messageSent: {
      subscribe(_, __, { pubSub }) {
        return pubSub.asyncIterator("MESSAGE_SENT");
      },
      resolve: (payload) => {
        return {
          message: payload.message,
        };
      },
    },
  },

  Mutation: {
    sendMessage: async (_, { message }, { pubSub }) => {
      pubSub.publish("MESSAGE_SENT", { message });
      return {
        message,
      };
    },
  },
};
