import { gql } from "apollo-server";

export default gql`
    extend type Query {
        answers: [Answer!]
        answer(id: ID!): Answer
    }
    
    extend type Mutation {
        createAnswer(text: String!, score: Int!, type: String!): Answer!
    }
  
    type Answer {
        ID: ID!
        RecrodType: String!
        answer: String!
        score: Int!
        type: String!
        date: String!
        user: User
    }
`;
