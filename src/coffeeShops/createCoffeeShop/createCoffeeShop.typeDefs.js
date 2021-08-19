import { gql } from "apollo-server";

export default gql`
    type CreateCoffeeShopResponse {
        success: Boolean!
        error: String
        coffeeShop: CoffeeShop
    }

    type Mutation {
        createCoffeeShop(
            name: String!
            latitude: String!
            longitude: String!
            photos: [Upload]
            categories: [String]
        ): CreateCoffeeShopResponse!
    }
`;