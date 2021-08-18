import { gql } from "apollo-server";

export default gql`
    type Query {
        seeProfile(id: Int!): User
    }
`;