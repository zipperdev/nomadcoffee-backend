import bcrypt from "bcrypt";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (_, {
            username, 
            email, 
            name, 
            password, 
            location
        }) => {
            const existUser = await client.user.findFirst({
                where: {
                    OR: [
                        { username }, 
                        { email }
                    ]
                }, 
                select: {
                    id: true
                }
            });
            if (existUser) {
                return {
                    success: false, 
                    error: "Username or email is already taken."
                };
            } else {
                const cryptedPassword = await bcrypt.hash(password, 10);
                await client.user.create({
                    data: {
                        username, 
                        email, 
                        name, 
                        password: cryptedPassword, 
                        location
                    }
                });
                return {
                    success: true
                };
            };
        }
    }
};