import axios from "axios";

const API_URL = process.env.API_URL;

export const createQuestion = async (input) =>
    await axios.post(API_URL, {
        query: `
            mutation ($input: CreateQuestionInput) {
                createQuestion(input: $input) {
                    ID
                    RecordType
                    text
                    popularity
                    category
                    date
                }
            }
        `,
        variables: input
    });

export const question = async (variables: {
    ID: string
}) =>
    await axios.post(API_URL, {
        query: `
            query ($ID: ID!) {
                question(ID: $ID) {
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

export const answerQuestion = async (variables: {
    QUE_ID: string, text: string, score: number, type: string
}) =>
    await axios.post(API_URL, {
        query: `
            mutation ($QUE_ID: ID!, $text: String!, $score: Int!, $type: String!) {
                answerQuestion(QUE_ID: $QUE_ID, text: $text, score: $score, type: $type) {
                    ID
                    RecordType
                    text
                    date
                    popularity
                    category
                }
            }
        `,
        variables
    });

export const questions = async (variables: {
    cursor?: string, limit?: number
}) =>
    await axios.post(API_URL, {
        query: `
            query ($cursor: String, $limit: Int) {
                questions (cursor: $cursor, limit: $limit) {
                    edges {
                        ID
                        RecordType
                        text
                        popularity
                        category
                        date
                    }
                    pageInfo {
                        cursor
                        count
                    }
                }
            }
        `,
        variables
    });


