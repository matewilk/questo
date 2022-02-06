import chatResolver from "./chat";
import { PubSub } from "graphql-subscriptions";

describe("Chat Resolver", () => {
  let contextMock = {
    pubSub: {
      asyncIterator: jest.fn(),
      publish: jest.fn(),
    } as unknown as PubSub,
  };
  describe("Subscription", () => {
    const { Subscription } = chatResolver;

    describe("chat", () => {
      it("should subscribe to chat by id", () => {
        const args = { id: "345" };

        Subscription.chat.subscribe(null, args, contextMock);

        expect(contextMock.pubSub.asyncIterator).toHaveBeenCalledWith(
          `CHAT_${args.id}`
        );
      });

      it("should resolve payload as expected", () => {
        const payload = { message: "test message" };
        const result = Subscription.chat.resolve(payload);

        expect(result).toEqual(payload);
      });
    });
  });

  describe("Mutation", () => {
    const { Mutation } = chatResolver;

    describe("sendMessage", () => {
      it("should publish and return message", async () => {
        const args = { chatId: "345", message: "test message" };

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
