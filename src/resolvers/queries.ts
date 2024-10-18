import * as yup from "yup";
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

  lecturerCourseClasses: async (_, { filter }, { user, courseClassesService }: AppContext) => {
    if (!user) throw UnauthorizedError;

    if (user.role !== "LECTURER") throw PermissionError;

    // Validate filter
    if (filter) {
      yup.string().max(255, "Class monitor's name is too long").validate(filter.classMonitorName);
      yup.string().max(255, "Class name is too long").validate(filter.className);
    }

    return await courseClassesService.getLecturerClasses(user.userId, filter);
  },
};

export default queries;
