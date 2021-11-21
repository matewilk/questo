import axios from "axios";

const API_URL = process.env.API_URL;

export const answers = async (variables: { QUE_ID: string }) =>
  await axios.post(API_URL, {
    query: `
        query ($QUE_ID: ID!) {
            answers(QUE_ID: $QUE_ID) {
                ID
                RecordType
                answer
                score
                type
                date
            }
        }
        `,
    variables,
  });
