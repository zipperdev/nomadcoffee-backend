import client from "../../client";
import { protectedResolver } from "../user.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
    const existUser = await client.user.findUnique({
        where: {
            username
        }, 
        select: {
            id: true
        }
    });
    if (!existUser) {
        return {
            success: false, 
            error: "User does not exist."
        };
    } else {
        const following = Boolean(await client.user.count({
            where: {
                id: loggedInUser.id, 
                following: {
                    some: {
                        username
                    }
                }
            }
        }));
        await client.user.update({
            where: {
                id: loggedInUser.id
            }, 
            data: {
                following: {
                    ...(following ? {
                        disconnect: {
                            username
                        }
                    } : {
                        connect: {
                            username
                        }
                    })
                }
            }
        });
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        toggleFollow: protectedResolver(resolverFn)
    }
};