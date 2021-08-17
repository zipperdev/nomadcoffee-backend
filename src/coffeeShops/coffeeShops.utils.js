import { uploadS3 } from "../shared/shared.utils";

export const getImageUrls = async (photos, loggedInUser) => {
    let urlObj = [];
    urlObj = await new Promise(async (resolver) => {
        for (let i = 0; i < photos.length; i++) {
            const photoUrl = await uploadS3(photos[i], loggedInUser.id);
            urlObj.push(photoUrl);
        };
        resolver(urlObj);
    });
    return urlObj.map(url => ({
        where: {
            url
        }, 
        create: {
            url
        }
    }));
};

export const getCategoryObj = (categories) => {
    return categories.map(category => ({
        where: {
            name: category
        },
        create: {
            name: category, 
            slug: category.split("_").join(" ")
        }
    }));
};