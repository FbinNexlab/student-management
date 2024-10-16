import { User } from "../entities/user.entity";
import { MutationResolvers } from "../generated/graphql";

const mutations: MutationResolvers = {
  signUp: async (_, { userInput }, { dataSources }) => {
    const user: User = new User();
    user.username = userInput.username;
    user.password = userInput.password;
    user.role = userInput.role;
    return dataSources.usersRepo.createNewUser(user);
  },
};

export default mutations;