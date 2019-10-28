import { gql } from "apollo-server";

export default gql`
	extend type Query {
		users: [User!]
		user(id: ID!): User
		me: User
	}
	
	type User {
		ID: ID!
		name: String!
		age: Int!
    answers: [Answer!]
		questions: [Question!]
	}
`;
