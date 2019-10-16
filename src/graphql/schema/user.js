import { gql } from "apollo-server";

export default gql`
	extend type Query {
		users: [User!]
		user(id: ID!): User
	}
	
	type User {
		ID: ID!
		name: String!
		age: Int!
	}
`;
