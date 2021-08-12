import client from "../../client";

export default {
    Query: {
        searchUsers: (_, { keyword }) => client.user.findMany({
            where: {
                username: {
                    startsWith: keyword
                }
            }
        })
    }
};