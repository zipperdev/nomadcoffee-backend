import { gql } from "apollo-server";

export default gql`
    type Mutation {
        createAccount(
            username: String!
            email: String!
            name: String!
            password: String!
            location: String!
        ): MutationResponse!
    }
`;