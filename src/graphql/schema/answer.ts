import { gql } from "apollo-server";

export default gql`
  extend type Query {
    answers: [Answer!]
    answer(id: ID!): Answer
  }
  
  type Answer {
    ID: ID!
    value: String!
    user: User
  }
`;
