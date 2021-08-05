import { gql } from "apollo-server";

export default gql`
    type CreateAccountResponse {
        success: Boolean!
        error: String
    }

    type Mutation {
        createAccount(
            username: String!
            email: String!
            name: String!
            password: String!
            location: String!
        ): CreateAccountResponse!
    }
`;