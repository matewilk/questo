import axios from "axios";

const API_URL = process.env.API_URL;

export const subscribeToChat = async (variables: { id: string }) =>
  await axios.post("ws://localhost:4000/api", {
    query: `
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
