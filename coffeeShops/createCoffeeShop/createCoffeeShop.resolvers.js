import { createWriteStream } from "fs";
import client from "../../client";
import { protectedResolver } from "../../users/user.utils";

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
            }
        });
        return coffeeShop;
    } catch(error) {
        console.log(error)
        return null;
    };
};

export default {
    Mutation: {
        createCoffeeShop: protectedResolver(resolverFn)
    }
};