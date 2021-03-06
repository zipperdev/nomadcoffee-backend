import client from "../../client";
import { protectedResolver } from "../../users/user.utils";
import { getCategoryObj, getImageUrls } from "../coffeeShops.utils";

const resolverFn = async (_, {
    name, 
    latitude, 
    longitude, 
    photos, 
    categories
}, { loggedInUser }) => {
    try {
        let categoryObj = null;
        let photosObj = null;
        if (categories && categories !== []) {
            categoryObj = getCategoryObj(categories);
        };
        if (photos && photos !== []) {
            photosObj = await getImageUrls(photos, loggedInUser);
        };
        const coffeeShop = await client.coffeeShop.create({
            data: {
                name, 
                latitude, 
                longitude, 
                user: {
                    connect: {
                        id: loggedInUser.id
                    }
                }, 
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
            }, 
            include: {
                user: true, 
                photos: true, 
                categories: true
            }
        });
        return {
            success: true, 
            coffeeShop
        };
    } catch {
        return {
            success: false, 
            error: "Cannot create coffee shop."
        };
    };
};

export default {
    Mutation: {
        createCoffeeShop: protectedResolver(resolverFn)
    }
};