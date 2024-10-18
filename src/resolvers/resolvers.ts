import { Resolvers } from "./../generated/graphql.js";
import Mutation from "./mutations.js";
import Query from "./queries.js";

const resolvers: Resolvers = { Query, Mutation };

export default resolvers;
