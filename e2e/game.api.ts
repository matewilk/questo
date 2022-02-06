import axios from "axios";
import { gql } from "apollo-server";

const API_URL = process.env.API_URL;

export const subscribeToGame = (variables: { id: string }) => ({
  query: gql`
    subscription Subscription($id: String) {
      game(id: $id) {
        key
      }
    }
  `,
  variables,
});

export const sendKeyPress = async (variables: {
  gameId: string;
  key: string;
}) =>
  await axios.post(API_URL, {
    query: `
      mutation KeyPress($gameId: String!, $key: String!) {
        keyPress(gameId: $gameId, key: $key) {
          key
        }
      }
    `,
    variables,
  });
