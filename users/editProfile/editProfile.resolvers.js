import bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import { protectedResolver } from "../user.utils";
import client from "../../client";

const resolverFn = async (_, {
    username, 
    email, 
    name, 
    location, 
    githubUsername, 
    password, 
    avatar
}, { loggedInUser }) => {
    let avatarUrl = null;
    let cryptedPassword = null;
    if (avatar) {
        const { filename, createReadStream } = await avatar;
        const randomFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const writeStream = createWriteStream(`${process.cwd()}/uploads/${randomFilename}`);
        readStream.pipe(writeStream);
        avatarUrl = `http://localhost:4000/static/${randomFilename}`;
    };
    if (password) {
        cryptedPassword = await bcrypt.hash(password, 10);
    };
    const updatedUser = await client.user.update({
        where: {
            id: loggedInUser.id
        }, 
        data: {
            username, 
            email, 
            name, 
            location, 
            githubUsername, 
            ...(cryptedPassword && { password: cryptedPassword }), 
            ...(avatarUrl && { avatarURL: avatarUrl })
        }
    });
    if (!updatedUser.id) {
        return {
            success: false, 
            error: "Cannot update profile."
        }
    } else {
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn)
    }
};