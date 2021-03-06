import { gql } from "apollo-server";

export default gql`
    type User {
        id: Int!
        username: String!
        email: String!
        name: String!
        location: String!
        saves(lastId: Int): [Save]
        followers(lastId: Int): [User]
        following(lastId: Int): [User]
        totalSaves: Int!
        totalFollowers: Int!
        totalFollowing: Int!
        isFollowing: Boolean!
        isMe: Boolean!
        coffeeShops: [CoffeeShop]
        avatarURL: String
        githubUsername: String
        createdAt: String!
        updatedAt: String!
    }
`;