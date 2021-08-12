import { gql } from "apollo-server";

export default gql`
    type Query {
        seeCoffeeShop(id: Int!): CoffeeShop
    }
`;