import client from "../../client";
import { removeS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/user.utils";
import { getCategoryObj, getImageUrls } from "../coffeeShops.utils";

const resolverFn = async (_, {
    id, 
    name, 
    latitude, 
    longitude, 
    photos, 
    categories
}, { loggedInUser }) => {
    try {
        const coffeeShop = await client.coffeeShop.findUnique({
            where: {
                id
            }, 
            include: {
                user: true, 
                categories: {
                    select: {
                        name: true
                    }
                }, 
                photos: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            }
        });
        if (loggedInUser.id !== coffeeShop.userId) {
            return {
                success: false, 
                error: "You are not owner."
            };
        } else {
            let categoryObj = null;
            let disconnectCategoryObj = null;
            let photosObj = null;
            if (categories[0]) {
                categoryObj = getCategoryObj(categories);
                disconnectCategoryObj = coffeeShop.categories;
                disconnectCategoryObj = disconnectCategoryObj.map(value => value.name).filter(value => !categories.includes(value)).map(value => ({ name: value }));
            };
            if (photos[0]) {
                for (let i = 0; i < coffeeShop.photos.length; i++) {
                    const photo = coffeeShop.photos[i];
                    await client.coffeeShopPhoto.delete({
                        where: {
                            id: photo.id
                        }
                    });
                    await removeS3(photo.url);
                };
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
                    categories: {
                        connectOrCreate: categoryObj, 
                        disconnect: disconnectCategoryObj
                    }, 
                    ...(photosObj && {
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
        console.log(error)
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