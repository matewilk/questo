import { gql } from "apollo-server";

export default gql`
	extend type Query {
		users: [User!]
	}
	
	type User {
		name: String!
		age: Int!
	}
`;
