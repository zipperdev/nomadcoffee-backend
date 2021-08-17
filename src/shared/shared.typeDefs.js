import { gql } from "apollo-server";

export default gql`
    scalar Upload

    type MutationResponse {
        success: Boolean!
        error: String
    }
`;