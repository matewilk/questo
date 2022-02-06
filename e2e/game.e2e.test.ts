import { gql } from "apollo-server";
import { PubSub } from "graphql-subscriptions";

import { gqClient } from "./helpers/wsApolloTestClient";
import {sendKeyPress, subscribeToGame} from './game.api';

describe("Game", () => {
  describe("Subscription", () => {
    describe("game(id: String): Game", () => {
      it("subscribes to game with given id and resolves", (done) => {
        const key = "c";
        const gameId = "123";
        const pubSub = new PubSub();

        gqClient(pubSub)
          // subscribe to chat
          .subscribe(subscribeToGame({ id: gameId }))
          // resolve on event publish
          .subscribe({
            next({ data }) {
              expect(data.game.key).toEqual(key);
              done();
            },
            error(errorValue: any) {
              console.log(errorValue);
            },
          });

        setTimeout(() => {
          pubSub.publish(`GAME_${gameId}`, { key });
        }, 100);
      });
    });
  });

  describe("Mutation", () => {
    describe("keyPress(chatId: String!, message: String!): Message", () => {
      it('publishes an event with key on pubsub bus and returns it', async () => {
        const key = "d";

        const { data } = await sendKeyPress({ gameId: "123", key })
        const result = data.data.keyPress.key;

        expect(result).toEqual(key);
      })
    })
  })
});
