import { gql } from "apollo-server";

export default gql`
  extend type Query {
    users: [User!]
    user(ID: ID!): User
    me: User
  }

  extend type Mutation {
    createUser(name: String!, type: UserRoleEnum!): User!
  }

  type User {
    ID: ID!
    RecordType: String!
    name: String! # text
    score: Int!
    type: UserRoleEnum!
    date: String!
    answers: [Answer!]
    questions: [Question!]
  }

  enum UserRoleEnum {
    ADMIN
    USER
  }
`;
