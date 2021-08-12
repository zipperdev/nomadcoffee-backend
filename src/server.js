require("dotenv").config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { getUser } from "./users/user.utils";
import { typeDefs, resolvers } from "./schema";

const PORT = process.env.PORT;

async function startServer() {
    const apollo = new ApolloServer({
        typeDefs, 
        resolvers, 
        context: async ({ req }) => {
            return {
                loggedInUser: await getUser(req.headers.autorization)
            };
        }
    });
    await apollo.start();
    const app = express();
  
    app.use(graphqlUploadExpress());
    apollo.applyMiddleware({ app });
    app.use("/static", express.static("uploads"));

    await new Promise(r => app.listen({ port: PORT }, r));
    console.log(`✅ Server on http://localhost:${PORT}`);
};
  
startServer();