import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
    Mutation: {
        login: async (_, { username, password }) => {
            const existUser = await client.user.findUnique({
                where: {
                    username
                }
            });
            if (!existUser) {
                return {
                    success: false, 
                    error: "User does not exists."
                };
            } else {
                const correctKey = await bcrypt.compare(password, existUser.password);
                if (!correctKey) {
                    return {
                        success: false, 
                        error: "Password is not correct."
                    };
                } else {
                    const token = jwt.sign({ id: existUser.id }, process.env.JWT_SECRET);
                    return {
                        success: true, 
                        token
                    };
                };
            };
        }
    }
};