import client from "../../client";

export default {
    Query: {
        seeCategory: (_, { id }) => client.category.findUnique({
            where: {
                id
            }
        })
    }
};