import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
    try {
        if (!token) {
            return null;
        } else {
            const { id } = await jwt.verify(token, process.env.JWT_SECRET);
            const existUser = await client.user.findUnique({
                where: {
                    id
                }
            });
            if (!existUser) {
                return null;
            } else {
                return existUser;
            };
        };
    } catch {
        return null;
    };
};

export const protectedResolver = (resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
        return {
            success: false, 
            error: "Please log in."
        };
    } else {
        return resolver(root, args, context, info);
    };
};