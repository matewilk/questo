import { ApolloServer } from "apollo-server";
import schema from "./graphql/schema";
import dotenv from "dotenv";

import resolvers from "./graphql/resolvers";
import QuestoSource from "./graphql/dataSource/questo";

dotenv.config();

const users = {
	1: { id: 1, name: 'Bob', age: 20 },
	2: { id: 2, name: 'Jane', age: 23 },
	3: { id: 3, name: 'Ted', age: 21 }
};

/**

 types: question, question:answer, question:user
 given a question find all answers

 GSI reverse lookup: for example PK user, SK question
 given a user find all questions (and answers??)

 Simple lookup: PK
 One to many relationship: PK and SK
 Many to many relationship: PK&SK and one or more GSI

 **/

const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
	context: {
		me: users[1]
	},
	dataSources: () => {
		return {
			questoSource: new QuestoSource()
		}
	}
});

server.listen().then(({ url }: { url: string }) => {
	console.log(`🚀  Server ready at ${url}`);
});
