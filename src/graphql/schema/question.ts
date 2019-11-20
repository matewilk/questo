import { gql } from "apollo-server";

export default gql`
	extend type Query {
		questions: [Question!]
		question(id: ID!): Question
	}
	
	extend type Mutation {
		createQuestion(text: String!): Question!
	}
	
	type Question {
		ID: ID!
        type: String!
#		text: String!
		answers: [Answer!]
	}
`;
