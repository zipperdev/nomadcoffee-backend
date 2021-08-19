import client from "../../client";

export default {
    Query: {
        seeCoffeeShop: (_, { id }) => client.coffeeShop.findUnique({
            where: {
                id
            }, 
            include: {
                user: true, 
                photos: true, 
                categories: true
            }
        })
    }
};