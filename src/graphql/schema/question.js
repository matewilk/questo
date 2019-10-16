import { gql } from "apollo-server";

export default gql`
	extend type Query {
		questions: [Question!]
		question(id: ID!): Question
	}
	
  type Question {
	  ID: ID!
    text: String!
    count: Int!
  }
`;
