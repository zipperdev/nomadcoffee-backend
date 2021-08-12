import AWS from "aws-sdk";

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY, 
        secretAccessKey: process.env.AWS_SECRET
    }
});

export const uploadS3 = async (file, userId) => {
    const { filename, createReadStream } = await file;
    const randomFilename = `${userId}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const upload = await new AWS.S3().upload({
        Bucket: "nomadcoffeeshop-uploads", 
        Key: randomFilename, 
        ACL: "public-read", 
        Body: readStream
    }).promise();
    return upload.Location;
};