import { gql } from "apollo-server";

import userSchema from "./user";
import answerSchema from "./answer";
import questionSchema from "./question"

const linkSchema = gql`
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }
`;

export default [
  linkSchema, userSchema, answerSchema, questionSchema
]
