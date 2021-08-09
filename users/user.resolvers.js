import client from "../client";

export default {
    User: {
        followers: ({ id }, { lastId }) => client.user.findMany({
            where: {
                following: {
                    some: {
                        id
                    }
                }
            }, 
            take: 10, 
            skip: lastId ? 1 : 0, 
            ...(lastId && { cursor: { id: lastId } })
        }), 
        following: ({ id }, { lastId }) => client.user.findMany({
            where: {
                followers: {
                    some: {
                        id
                    }
                }
            }, 
            take: 10, 
            skip: lastId ? 1 : 0, 
            ...(lastId && { cursor: { id: lastId } })
        }), 
        totalFollowers: ({ id }) => client.user.count({
            where: {
                following: {
                    some: {
                        id
                    }
                }
            }
        }), 
        totalFollowing: ({ id }) => client.user.count({
            where: {
                followers: {
                    some: {
                        id
                    }
                }
            }
        }), 
        isFollowing: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            } else {
                const exist = await client.user.count({
                    where: {
                        username: loggedInUser.username, 
                        following: {
                            some: {
                                id
                            }
                        }
                    }
                })
                return Boolean(exist);
            };
        }, 
        isMe: ({ id }, _, { loggedInUser }) => id === loggedInUser?.id
    }
};