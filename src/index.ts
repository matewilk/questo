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

// const questions = {
// 	1: { id: 1, text: 'How old are you?' },
// 	2: { id: 2, text: 'What is your favorite colour?' },
// 	3: { id: 3, text: 'What is your name?' }
// };
//
// const answers = {
// 	1: { value: '23', user: users[1], question: questions[0] },
// 	2: { value: 'blue', user: users[1], question: questions[1] },
// 	3: { value: 'Jane', user: users[1], question: questions[2] },
//
// 	4: { value: '55', user: users[0], question: questions[0] },
// 	5: { value: 'red', user: users[0], question: questions[1] },
// 	6: { value: 'Rob', user: users[0], question: questions[2] },
//
// 	7: { value: '21', user: users[2], question: questions[0] },
// 	8: { value: 'pink', user: users[2], question: questions[1] },
// 	9: { value: 'Ted', user: users[2], question: questions[2] },
// };

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
