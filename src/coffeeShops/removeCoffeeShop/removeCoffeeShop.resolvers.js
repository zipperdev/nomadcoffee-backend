import client from "../../client";
import { protectedResolver } from "../../users/user.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
    const coffeeShop = await client.coffeeShop.findUnique({
        where: {
            id
        }
    });
    if (!coffeeShop) {
        return {
            success: false, 
            error: "Coffee shop does not exists."
        };
    } else if (coffeeShop.userId !== loggedInUser.id) {
        return {
            success: false, 
            error: "Please log in as owner."
        };
    } else {
        await client.coffeeShop.delete({
            where: {
                id
            }
        });
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        removeCoffeeShop: protectedResolver(resolverFn)
    }
};