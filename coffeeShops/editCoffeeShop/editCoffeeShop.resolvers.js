import client from "../../client";
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
                categoryObj = categories.map(category => ({
                    where: {
                        name: category
                    },
                    create: {
                        name: category, 
                        slug: category
                    }
                }));
            };
            if (photos && photos !== []) {
                let urlObj = [];
                urlObj = await photos.map(async photo => {
                    const { filename, createReadStream } = await photo;
                    const randomFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
                    const readStream = createReadStream();
                    const writeStream = createWriteStream(`${process.cwd()}/uploads/${randomFilename}`);
                    readStream.pipe(writeStream);
                    const photoUrl = `http://localhost:4000/static/${randomFilename}`;
                    urlObj.push(photoUrl);
                    return urlObj;
                });
                photosObj = (await urlObj[0]).map(url => ({
                    where: {
                        url
                    }, 
                    create: {
                        url
                    }
                }));
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
    } catch {
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