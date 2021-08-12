import client from "../../client";
import { getImageUrls } from "../coffeeShops.utils";
import { protectedResolver } from "../../users/user.utils";

const resolverFn = async (_, {
    id, 
    name, 
    latitude, 
    longitude, 
    photos, 
    categories
}, { loggedInUser }) => {
    try {
        const coffeeShopOwner = (await client.coffeeShop.findUnique({
            where: {
                id
            }, 
            select: {
                user: true
            }
        })).user;
        if (loggedInUser.id !== coffeeShopOwner.id) {
            return {
                success: false, 
                error: "You are not owner."
            };
        } else {
            let categoryObj = null;
            let photosObj = null;
            if (categories && categories !== []) {
                categoryObj = getCategoryObj(categories);
            };
            if (photos && photos !== []) {
                photosObj = await getImageUrls(photos, loggedInUser);
            };
            await client.coffeeShop.update({
                where: {
                    id
                }, 
                data: {
                    name, 
                    latitude, 
                    longitude, 
                    ...(categoryObj?.length > 0 && {
                        categories: {
                            connectOrCreate: categoryObj
                        }
                    }), 
                    ...(photosObj?.length > 0 && {
                        photos: {
                            connectOrCreate: photosObj
                        }
                    })
                }
            });
            return {
                success: true
            };
        };
    } catch(error) {
        console.log(error);
        return {
            success: false, 
            error: "Cannot edit coffee shop."
        };
    };
};

export default {
    Mutation: {
        editCoffeeShop: protectedResolver(resolverFn)
    }
};