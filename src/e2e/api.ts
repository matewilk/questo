import axios from "axios";

const API_URL = process.env.API_URL;

export const createQuestion = async (variables: {text: string, popularity: number, category: string}) =>
    await axios.post(API_URL, {
        query: `
            mutation ($text: String!, $popularity: Int!, $category: String!) {
                createQuestion(text: $text, popularity: $popularity, category: $category) {
                    ID
                    RecordType
                    text
                    popularity
                    category
                    date
                }
            }
        `,
        variables
    });
