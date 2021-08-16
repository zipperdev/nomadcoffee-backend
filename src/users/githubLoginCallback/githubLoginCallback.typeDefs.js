import { gql } from "apollo-server";

export default gql`
    type GithubLoginCallbackResponse {
        success: Boolean!
        token: String
        error: String
    }

    type Mutation {
        githubLoginCallback(code: String!): GithubLoginCallbackResponse!
    }
`;