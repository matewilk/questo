import { gql } from "apollo-server";

import userSchema from "./user";
import answerSchema from "./answer";
import questionSchema from "./question";
import healthSchema from "./health";

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
  linkSchema,
  healthSchema,
  userSchema,
  answerSchema,
  questionSchema,
];
