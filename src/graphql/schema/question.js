import { gql } from "apollo-server";

export default gql`
	extend type Query {
		questions: [Question!]
	}
	
  type Question {
    text: String!
    count: Int!
  }
`;
