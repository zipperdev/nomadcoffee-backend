import AWS from "aws-sdk";

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY, 
        secretAccessKey: process.env.AWS_SECRET
    }
});

const BUCKET_NAME = "nomadcoffeeshop-uploads";

export const uploadS3 = async (file, userId) => {
    const { filename, createReadStream } = await file;
    const randomFilename = `${userId}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const upload = await new AWS.S3().upload({
        Bucket: BUCKET_NAME, 
        Key: randomFilename, 
        ACL: "public-read", 
        Body: readStream
    }).promise();
    return upload.Location;
};

export const removeS3 = async filename => {
    const filePath = filename.split("/")[filename.split("/").length - 1];
    await new AWS.S3().deleteObject({
        Bucket: BUCKET_NAME, 
        Key: filePath
    }).promise();
};