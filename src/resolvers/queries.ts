import { QueryResolvers } from "../generated/graphql";
const queries: QueryResolvers = {
  courseClass: async (_, { id }, { dataSources }) => {
    return dataSources.userRepo.getCourseClassById(id);
  },
  profile: async (_, {}, { user, dataSources }) => {
    if (!user) {
      throw new Error("User unauthorized");
    }

    return user;
  },
};

export default queries;
