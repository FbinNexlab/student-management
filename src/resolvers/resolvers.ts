import { Resolvers } from "./../generated/graphql";
import Mutation from "./mutations";
import Query from "./queries";

const resolvers: Resolvers = { Query, Mutation };

export default resolvers;
