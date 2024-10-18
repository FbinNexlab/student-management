import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { IncomingMessage } from "http";
import { Redis } from "ioredis";
import { CourseClassesRepo } from "./repos/course-classes.repo.js";
import { UsersRepo } from "./repos/users.repo.js";
import resolvers from "./resolvers/resolvers.js";
import { CourseClassesService } from "./services/course-classes.service.js";
import { JwtPayload, JwtService } from "./services/jwt.service.js";
import { UsersService } from "./services/users.service.js";

require("dotenv").config();

const typeDefs = readFileSync("src/schema.graphql", { encoding: "utf-8" });

export interface AppContext {
  user: JwtPayload | null;
  usersService: UsersService;
  courseClassesService: CourseClassesService;
}

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
});

const extractToken = (req: IncomingMessage) => {
  const authorization = req.headers.authorization || "";
  return authorization.replace("Bearer ", "");
};

const validateToken = async (token: string, jwtService: JwtService) => {
  let user: JwtPayload | null = null;
  if (token) {
    try {
      user = jwtService.verify(token);

      // Check if the token is invalidated
      const isInvalidated = await jwtService.isTokenInvalidated(user.jti);
      if (isInvalidated) {
        user = null;
        console.error("Token is invalidated");
      }
    } catch (error) {
      user = null;
      console.error("Invalid token", error);
    }
  }

  return user;
};

async function startServer() {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD || "default",
  });
  const jwtService: JwtService = new JwtService(redis);
  const usersRepo = new UsersRepo();
  const courseClassesRepo = new CourseClassesRepo();
  const usersService = new UsersService(usersRepo, jwtService);
  const courseClassesService = new CourseClassesService(courseClassesRepo, usersRepo);

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = extractToken(req);
      const user = await validateToken(token, jwtService);

      return {
        user,
        usersService,
        courseClassesService,
      };
    },
  });

  console.log(`🚀 Server listening at: ${url}`);
}

startServer();
