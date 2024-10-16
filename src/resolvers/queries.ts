import { QueryResolvers } from "../generated/graphql";
const queries: QueryResolvers = {
  courseClass: async (_, { id }, { dataSources }) => {
    return dataSources.userRepo.getCourseClassById(id);
  },
  user: async (_, { id }, { dataSources }) => {
    return dataSources.userAPI.getUserById(id);
  },
};

export default queries;
