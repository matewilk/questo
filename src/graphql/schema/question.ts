import { gql } from "apollo-server";

const createQuestionFields = `
  text: String!
  popularity: Int!
  category: String!
`;

export default gql`
  extend type Query {
    questions(cursor: String, limit: Int): Questions!
    question(ID: ID!): Question
  }

  input CreateQuestionInput {
    ${createQuestionFields}
  }

  extend type Mutation {
    createQuestion(${createQuestionFields}): Question!
    answerQuestion(
      QUE_ID: ID!
      text: String!
      score: Int!
      type: String!
    ): Question!
  }

  type PageInfo {
    count: Int
    cursor: String
  }

  type Questions {
    edges: [Question!]
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
