import { gql } from "apollo-server";

export default gql`
	extend type Query {
		questions: [Question!]
		question(ID: ID!): Question
	}
	
	extend type Mutation {
		createQuestion(text: String!, popularity: Int!, category: String!): Question!
		answerQuestion(QUE_ID: ID!, text: String!, score: Int!, type: String!): Question!
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
