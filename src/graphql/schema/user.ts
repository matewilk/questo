import { gql } from "apollo-server";

export default gql`
  extend type Query {
    users: [User!]
    user(ID: ID!): User
    currentUser: User
    logout: Logout
  }

  extend type Mutation {
    createUser(name: String!, type: UserRoleEnum!): User!
    login(name: String!, password: String!): User!
  }
  
  type Logout {
    success: Boolean
  }

  type User {
    ID: ID
    RecordType: String
    name: String # text
    score: Int
    type: UserRoleEnum
    date: String
    answers: [Answer!]
    questions: [Question!]
  }

  enum UserRoleEnum {
    ADMIN
    USER
  }
`;
