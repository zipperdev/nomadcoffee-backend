import client from "../client";

export default {
    CoffeeShop: {
        likes: ({ id }) => client.like.count({
            where: {
                coffeeShopId: id
            }
        }), 
        saves: ({ id }) => client.save.count({
            where: {
                coffeeShopId: id
            }
        })
    }, 
    Category: {
        shops: ({ id }, { lastId }) => client.coffeeShop.findMany({
            where: {
                categories: {
                    some: {
                        id
                    }
                }
            }, 
            take: 10, 
            skip: lastId ? 1 : 0, 
            ...(lastId && { cursor: { id: lastId } })
        }), 
        totalShops: ({ id }) => client.coffeeShop.count({
            where: {
                categories: {
                    some: {
                        id
                    }
                }
            }
        })
    }
};