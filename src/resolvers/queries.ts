import { AppContext } from "..";
import { PermissionError, UnauthorizedError } from "../errors/auth.error";
import { QueryResolvers } from "../generated/graphql";
const queries: QueryResolvers = {
  profile: async (_, {}, { user, usersService }: AppContext) => {
    if (!user) {
      throw new Error("User unauthorized");
    }

    return await usersService.getProfile(user.email);
  },

  lecturerCourseClasses: async (_, {}, { user, courseClassesService }: AppContext) => {
    if (!user) throw UnauthorizedError;

    if (user.role !== "LECTURER") throw PermissionError;

    return await courseClassesService.getLecturerClasses(user.userId);
  },
};

export default queries;
