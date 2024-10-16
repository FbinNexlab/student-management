import { AppContext } from "..";
import { QueryResolvers } from "../generated/graphql";
const queries: QueryResolvers = {
  profile: async (_, {}, { user, usersService }: AppContext) => {
    if (!user) {
      throw new Error("User unauthorized");
    }

    return usersService.getProfile(user.email);
  },
};

export default queries;
