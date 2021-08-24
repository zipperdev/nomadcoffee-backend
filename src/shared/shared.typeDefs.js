import { gql } from "apollo-server";

export default gql`
    scalar Upload

    type MutationResponse {
        success: Boolean!
        error: String
    }

    type SearchResponse {
        users: [User]
        coffeeShops: [CoffeeShop]
    }

    type Query {
        search(
            keyword: String!, 
            userLastId: Int, 
            coffeeShopLastId: Int
        ): SearchResponse!
    }
`;