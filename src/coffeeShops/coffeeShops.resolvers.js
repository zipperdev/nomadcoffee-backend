import client from "../client";

export default {
    Category: {
        shops: ({ id }, { lastId }) => client.coffeeShop.findMany({
            where: {
                categories: {
                    some: {
                        id
                    }
                }
            }, 
            take: 30, 
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