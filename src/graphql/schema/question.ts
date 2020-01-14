import { gql } from "apollo-server";

export default gql`	
	extend type Query {
		questions (limit: Int, cursor: String): Questions!
		question (ID: ID!): Question
	}
	
	extend type Mutation {
		createQuestion(text: String!, popularity: Int!, category: String!): Question!
		answerQuestion(QUE_ID: ID!, text: String!, score: Int!, type: String!): Question!
	}
	
	type PageInfo {
		count: String!
		cursor: String
	}
	
	type Questions {
		items: [Question!]
		pageInfo: PageInfo
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
