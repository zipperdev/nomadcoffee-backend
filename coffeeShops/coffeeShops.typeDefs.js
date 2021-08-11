import { gql } from "apollo-server";

export default gql`
    type CoffeeShopPhoto {
        id: Int!
        url: String!
        shop: CoffeeShop!
        createdAt: String!
        updatedAt: String!
    }

    type CoffeeShop {
        id: Int!
        name: String!
        latitude: String!
        longitude: String!
        user: User!
        photos: [CoffeeShopPhoto]
        categories: [Category]
        createdAt: String!
        updatedAt: String!
    }

    type Category {
        id: Int!
        name: String!
        slug: String
        shops: [CoffeeShop]
        totalShops: Int!
        createdAt: String!
        updatedAt: String!
    }
`;