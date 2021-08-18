import { gql } from "apollo-server";

export default gql`
    type Mutation {
        removeCoffeeShop(id: Int!): MutationResponse!
    }
`;