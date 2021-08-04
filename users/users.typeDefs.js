import { gql } from "apollo-server";

export default gql`
    type User {
        id: Int!
        username: String!
        email: String!
        name: String!
        location: String!
        avatarURL: String
        githubUsername: String
        createdAt: String!
        updatedAt: String!
    }

    type MutationResponse {
        success: Boolean!
        error: String
    }

    type Query {
        userQuery: User
    }

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