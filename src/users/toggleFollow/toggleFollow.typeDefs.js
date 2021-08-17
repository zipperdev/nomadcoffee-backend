import { gql } from "apollo-server";

export default gql`
    type Mutation {
        toggleFollow(username: String!): MutationResponse!
    }
`;