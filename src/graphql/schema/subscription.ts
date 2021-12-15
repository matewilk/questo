import { gql } from "apollo-server";

export default gql`
    extend type Subscription {
        messageSent: Message
    }
    
    extend type Mutation {
        sendMessage(message: String!): Message
    }

    type Message {
        message: String
    }
`;
