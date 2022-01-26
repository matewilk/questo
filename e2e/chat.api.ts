import axios from "axios";
import { gql } from "apollo-server";

const API_URL = process.env.API_URL;

export const subscribeToChat = (variables: { id: string }) => ({
  query: gql`
    subscription Subscription($id: String) {
      chat(id: $id) {
        message
      }
    }
  `,
  variables,
});

export const sendChatMessage = async (variables: {
  chatId: string;
  message: string;
}) =>
  await axios.post(API_URL, {
    query: `
      mutation SendMessage($chatId: String!, $message: String!) {
        sendMessage(chatId: $chatId, message: $message) {
          message
        }
      }
    `,
    variables,
  });
