import { GraphQLUpload } from "graphql-upload";
import client from "../client";

export default {
    Upload: GraphQLUpload, 
    Query: {
        search: async (_, { keyword, userLastId, coffeeShopLastId }) => {
            const users = await client.user.findMany({
                where: {
                    OR: [
                        {
                            username: {
                                startsWith: keyword
                            }
                        }, 
                        {
                            name: {
                                startsWith: keyword
                            }
                        }, 
                        {
                            githubUsername: {
                                contains: keyword
                            }
                        }
                    ]
                }, 
                orderBy: {
                    createdAt: "desc"
                }, 
                take: 20, 
                skip: userLastId ? 1 : 0, 
                ...(userLastId && { cursor: { id: userLastId } })
            });
            const coffeeShops = await client.coffeeShop.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: keyword
                            }
                        }, 
                        {
                            categories: {
                                some: {
                                    name: {
                                        startsWith: keyword
                                    }
                                }
                            }
                        }, 
                        {
                            user: {
                                OR: [
                                    {
                                        username: {
                                            startsWith: keyword
                                        }
                                    }, 
                                    {
                                        name: {
                                            startsWith: keyword
                                        }
                                    }, 
                                    {
                                        githubUsername: {
                                            contains: keyword
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }, 
                include: {
                    user: true, 
                    photos: true, 
                    categories: true
                }, 
                orderBy: {
                    createdAt: "desc"
                }, 
                take: 10, 
                skip: coffeeShopLastId ? 1 : 0, 
                ...(coffeeShopLastId && { cursor: { id: coffeeShopLastId } })
            });
            return {
                users, 
                coffeeShops
            };
        }
    }
};