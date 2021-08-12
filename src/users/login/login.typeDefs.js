import { gql } from "apollo-server";

export default gql`
    type LoginResponse {
        success: Boolean!
        token: String
        error: String
    }

    type Mutation {
        login(
            username: String!
            password: String!
        ): LoginResponse!
    }
`;