import client from "../../client";
import { protectedResolver } from "../../users/user.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
    const coffeeShop = await client.coffeeShop.findUnique({
        where: {
            id
        }, 
        select: {
            userId: true
        }
    });
    if (!coffeeShop) {
        return {
            success: false, 
            error: "Cannot find coffee shop."
        };
    } else {
        const isSaved = Boolean(
            await client.save.findUnique({
                where: {
                    userId_coffeeShopId: {
                        userId: loggedInUser.id, 
                        coffeeShopId: id
                    }
                }
            })
        );
        if (isSaved) {
            await client.save.delete({
                where: {
                    userId_coffeeShopId: {
                        userId: loggedInUser.id, 
                        coffeeShopId: id
                    }
                }
            });
        } else {
            await client.save.create({
                data: {
                    user: {
                        connect: {
                            id: loggedInUser.id
                        }
                    }, 
                    coffeeShop: {
                        connect: {
                            id
                        }
                    }
                }
            });
        };
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        toggleSave: protectedResolver(resolverFn)
    }
};