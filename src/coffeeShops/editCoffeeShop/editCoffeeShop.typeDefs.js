import { gql } from "apollo-server";

export default gql`
    type EditCoffeeShopResponse {
        success: Boolean!
        error: String
    }

    type Mutation {
        editCoffeeShop(
            id: Int!
            name: String
            latitude: String
            longitude: String
            photos: [Upload]
            categories: [String]
        ): EditCoffeeShopResponse!
    }
`;