import gameResolver from "./game";
import { PubSub } from "graphql-subscriptions";

describe("Game Resolver", () => {
  let contextMock = {
    pubSub: {
      asyncIterator: jest.fn(),
      publish: jest.fn(),
    } as unknown as PubSub,
  };

  describe("Subscription", () => {
    const { Subscription } = gameResolver;

    describe("game", () => {
      it("should subscribe to pubSub by game id", () => {
        const args = { id: "123" };

        Subscription.game.subscribe(null, args, contextMock);

        expect(contextMock.pubSub.asyncIterator).toHaveBeenCalledWith(
          `GAME_${args.id}`
        );
      });

      it("should resolve payload as expected", () => {
        const payload = { key: "a" };
        const result = Subscription.game.resolve(payload);

        expect(result).toEqual(payload);
      });
    });
  });

  describe("Mutation", () => {
    const { Mutation } = gameResolver;

    describe("keyPress", () => {
      it("should publish and return key string", async () => {
        const args = { gameId: "123", key: "b" };

        const result = await Mutation.keyPress(null, args, contextMock);

        expect(contextMock.pubSub.publish).toHaveBeenCalledWith(
          `GAME_${args.gameId}`,
          { key: args.key }
        );
        expect(result).toEqual({ key: args.key });
      });
    });
  });
});
