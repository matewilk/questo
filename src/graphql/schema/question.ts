import { gql } from "apollo-server";

export default gql`
	extend type Query {
		questions: [Question!]
		question(ID: ID!): Question
	}
	
	extend type Mutation {
		createQuestion(text: String!): Question!
	}
	
	type Question {
		ID: ID!
        RecordType: String!
		text: String!
        popularity: Int!
        category: String!
        date: String!
		answers: [Answer!]
	}
`;
