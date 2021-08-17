import { gql } from "apollo-server";

export default gql`
    type Mutation {
        editProfile(
            username: String
            email: String
            name: String
            location: String
            githubUsername: String
            password: String
            avatar: Upload
        ): MutationResponse!
    }
`;