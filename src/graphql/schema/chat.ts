import { gql } from "apollo-server";

export default gql`
  extend type Subscription {
    chat(id: String): Message
  }

  extend type Mutation {
    sendMessage(chatId: String!, message: String!): Message
  }

  type Message {
    message: String
  }
`;
