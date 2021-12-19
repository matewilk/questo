import { gql } from "apollo-server";
import { PubSub } from "graphql-subscriptions";

import { gqClient } from "./helpers/wsApolloTestClient";

describe("Chat", () => {
  describe("Subscription", () => {
    describe("chat(id: String): Message", () => {
      it("subscribes to chat with given id and resolves", (done) => {
        const message = "test message";
        const chatId = "123";
        const pubSub = new PubSub();

        gqClient(pubSub)
          // subscribe to chat
          .subscribe({
            query: gql`
              subscription Subscription($id: String) {
                chat(id: $id) {
                  message
                }
              }
            `,
            variables: { id: chatId },
          })
          // resolve on event publish
          .subscribe({
            next({ data }) {
              expect(data.chat.message).toEqual(message);
              done();
            },
            error(errorValue: any) {
              console.log(errorValue);
            },
          });

        setTimeout(() => {
          pubSub.publish(`CHAT_${chatId}`, { message });
          // sendChatMessage({ chatId: "123", message: "test 12345" });
        }, 100);
      });
    });
  });
});
