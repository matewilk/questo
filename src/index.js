import { ApolloServer, gql } from "apollo-server";
import schema from "./graphql/schema";
import dotenv from "dotenv";

dotenv.config();

const users = [
	{ id: 1, name: 'Bob', age: 20 },
	{ id: 2, name: 'Jane', age: 23 },
	{ id: 3, name: 'Ted', age: 21 }
];

const questions = [
	{ id: 1, text: 'How old are you?' },
	{ id: 2, text: 'What is your favorite colour?' },
	{ id: 3, text: 'What is your name?' }
];

const answers = [
	{ value: '23', user: users[1], question: questions[0] },
	{ value: 'blue', user: users[1], question: questions[1] },
	{ value: 'Jane', user: users[1], question: questions[2] },

	{ value: '55', user: users[0], question: questions[0] },
	{ value: 'red', user: users[0], question: questions[1] },
	{ value: 'Rob', user: users[0], question: questions[2] },

	{ value: '21', user: users[2], question: questions[0] },
	{ value: 'pink', user: users[2], question: questions[1] },
	{ value: 'Ted', user: users[2], question: questions[2] },
];

/**

 types: question, question:answer, question:user
 given a question find all answers

 GSI reverse lookup: for example PK user, SK question
 given a user find all questions (and answers??)

 Simple lookup: PK
 One to many relationship: PK and SK
 Many to many relationship: PK&SK and one or more GSI

 **/

const resolvers = {
	Query: {
		answers: () => answers,
		answer: (parent, args) => answers[args.id],
		questions: () => questions,
		question: (parent, args) => questions[args.id],
		users: () => users,
		user: (parent, args) => users[args.id],
	}
};

const server = new ApolloServer({
	typeDefs: schema,
	resolvers
});

server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
