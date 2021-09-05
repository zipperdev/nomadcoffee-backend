import { gql } from "apollo-server";

export default gql`
    type Mutation {
        toggleSave(id: Int!): MutationResponse!
    }
`;