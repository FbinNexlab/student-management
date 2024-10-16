import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import * as Jwt from "jsonwebtoken";
import { UsersRepo } from "./repos/users.repo";
import resolvers from "./resolvers/resolvers";

require("dotenv").config();

const typeDefs = readFileSync("src/schema.graphql", { encoding: "utf-8" });

interface MyContext {
  dataSources: {
    usersRepo: UsersRepo;
  };
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      const authorization = req.headers.authorization || "";
      const token = authorization.replace("Bearer ", "");
      let user = null;

      // Validate the token
      if (token) {
        try {
          user = Jwt.verify(token, process.env.JWT_SECRET || "secret");
        } catch (error) {
          console.error("Invalid token", error);
          user = null;
        }
      }

      return {
        user,
        dataSources: {
          usersRepo: new UsersRepo(),
        },
      };
    },
  });

  console.log(`🚀 Server listening at: ${url}`);
}

startServer();
