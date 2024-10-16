import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { UsersRepo } from "./repos/users.repo";
import resolvers from "./resolvers/resolvers";

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
    context: async () => {
      return {
        dataSources: {
          usersRepo: new UsersRepo(),
        },
      };
    },
  });

  console.log(`🚀 Server listening at: ${url}`);
}

startServer();
