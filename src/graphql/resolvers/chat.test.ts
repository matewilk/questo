import chatResolver from "./chat";

describe("Chat Resolver", () => {
  let contextMock = {
    pubSub: {
      asyncIterator: jest.fn(),
      publish: jest.fn(),
    },
  };
  describe("Subscription", () => {
    const { Subscription } = chatResolver;

    describe("chat", () => {
      it("should subscribe to chat by id", () => {
        const args = { id: "chatId" };

        Subscription.chat.subscribe(null, args, contextMock);

        expect(contextMock.pubSub.asyncIterator).toHaveBeenCalledWith(
          `CHAT_${args.id}`
        );
      });

      it("should resolve payload as expected", () => {
        const message = { message: "test message" };
        const result = Subscription.chat.resolve(message);

        expect(result).toEqual(message);
      });
    });
  });

  describe("Mutation", () => {
    const { Mutation } = chatResolver;

    describe("sendMessage", () => {
      it("should publish and return message", async () => {
        const args = { chatId: "123", message: "test message" };

        const result = await Mutation.sendMessage(null, args, contextMock);

        expect(contextMock.pubSub.publish).toHaveBeenCalledWith(
          `CHAT_${args.chatId}`,
          { message: args.message }
        );

        expect(result).toEqual({ message: args.message });
      });
    });
  });
});
