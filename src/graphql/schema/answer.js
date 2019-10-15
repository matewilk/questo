import { gql } from "apollo-server";

export default gql`
  extend type Query {
    answers: [Answer!]
  }
  
  type Answer {
    value: String!
  }
`;
