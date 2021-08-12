import bcrypt from "bcrypt";
import { protectedResolver } from "../user.utils";
import { uploadS3 } from "../../shared/shared.utils";
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
        avatarUrl = await uploadS3(avatar, loggedInUser.id);
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