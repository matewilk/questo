import axios from "axios";

const API_URL = process.env.API_URL;

export const createUser = async (variables: {
    name: string, type: string
}) =>
    await axios.post(API_URL, {
        query: `
            mutation ($name: String!, $type: String!) {
                createUser(name: $name, type: $type) {
                    ID
                    RecordType
                    name
                    score
                    type
                    date
                }
            }
        `,
        variables
    });

export const user = async (variables: {
    ID: string
}) =>
    await axios.post(API_URL, {
        query: `
            query ($ID: ID!) {
                user(ID: $ID) {
                    ID
                    RecordType
                    name
                    score
                    type
                    date
                }
            }
        `,
        variables
    });
