import { gql } from "apollo-server";

export default gql`
  extend type Query {
    health: Healthy
  }

  type Healthy {
    success: Boolean
  }
`;
