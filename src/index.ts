import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { JwtPayload } from "jsonwebtoken";
import { UsersRepo } from "./repos/users.repo";
import resolvers from "./resolvers/resolvers";
import { JwtService } from "./services/jwt.service";
import { UsersService } from "./services/users.service";

require("dotenv").config();

const typeDefs = readFileSync("src/schema.graphql", { encoding: "utf-8" });

export interface AppContext {
  user: JwtPayload | null;
  usersService: UsersService;
}

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      const authorization = req.headers.authorization || "";
      const token = authorization.replace("Bearer ", "");
      const usersRepo = new UsersRepo();
      const jwtService: JwtService = new JwtService();
      let user: JwtPayload | null = null;

      // Validate the token
      if (token) {
        try {
          user = jwtService.verify(token);
        } catch (error) {
          user = null;
          console.error("Invalid token", error);
        }
      }

      return {
        user,
        // Perform dependency injection
        usersService: new UsersService(usersRepo, jwtService),
      };
    },
  });

  console.log(`🚀 Server listening at: ${url}`);
}

startServer();
