import * as yup from "yup";
import { AppContext } from "..";
import { PermissionError, UnauthorizedError } from "../errors/auth.error";
import { CourseClassStatus, MutationResolvers, UserRole } from "../generated/graphql";

const mutations: MutationResolvers = {
  signUp: async (_, { userInput }, { usersService }: AppContext) => {
    // Validate the user input
    await yup.string().required("Email is required").email("Email is invalid.").validate(userInput.email);
    await yup
      .string()
      .required("Full name is required.")
      .max(255, "Full name is too long.")
      .validate(userInput.fullName);
    await yup
      .string()
      .required("Password is required.")
      .min(6, "Password requires at least 6 characters.")
      .validate(userInput.password);
    await yup
      .string()
      .required("Role is required.")
      .oneOf(Object.values(UserRole), "Role is invalid.")
      .validate(userInput.role);

    await usersService.signUp(userInput.email, userInput.fullName, userInput.password, userInput.role);

    return {
      message: "User created successfully",
    };
  },

  login: async (_, { email, password }, { usersService }: AppContext) => {
    // Validate input
    await yup.string().email("Email is invalid.").validate(email);
    await yup.string().min(6, "Password requires at least 6 characters").validate(password);

    const token = await usersService.login(email, password);

    return {
      message: "Login successful",
      token,
    };
  },

  logout: async (_, {}, { user, usersService }: AppContext) => {
    if (!user) {
      throw UnauthorizedError;
    }

    await usersService.logout(user.jti);

    return {
      message: "Logout successful",
    };
  },

  editProfile: async (_, { userUpdateInput }, { user, usersService }: AppContext) => {
    if (!user) {
      throw UnauthorizedError;
    }

    // Validate the user input
    await yup.string().max(255, "Full name is too long.").validate(userUpdateInput.fullName);

    const passwordValidator = yup.string().min(6, "Password requires at least 6 characters.");
    await passwordValidator.validate(userUpdateInput.oldPassword);
    await passwordValidator.validate(userUpdateInput.newPassword);

    await usersService.updateProfile(
      user.email,
      userUpdateInput.fullName,
      userUpdateInput.oldPassword,
      userUpdateInput.newPassword
    );

    return {
      message: "Profile updated successfully",
    };
  },

  createCourseClass: async (_, { createCourseClassInput }, { user, courseClassesService }: AppContext) => {
    if (!user) {
      throw UnauthorizedError;
    }

    if (user.role !== UserRole.Lecturer) {
      throw PermissionError;
    }

    // Validate input
    await yup
      .string()
      .required("Class name is required.")
      .max(255, "Class name is too long.")
      .validate(createCourseClassInput.className);
    await yup
      .string()
      .required("Course name is required.")
      .max(255, "Course name is too long.")
      .validate(createCourseClassInput.courseName);
    await yup
      .string()
      .required("Monitor's email is required")
      .email("Monitor's email is invalid.")
      .validate(createCourseClassInput.emailClassMonitor);

    await courseClassesService.createNewClass(createCourseClassInput, user.email);

    return {
      message: "Course class created successfully",
    };
  },

  updateCourseClass: async (_, { id, updateCourseClassInput }, { user, courseClassesService }: AppContext) => {
    if (!user) {
      throw UnauthorizedError;
    }

    if (user.role !== UserRole.Lecturer) {
      throw PermissionError;
    }

    // Validate input
    await yup.string().max(255, "Class name is too long.").validate(updateCourseClassInput.className);
    await yup.string().max(255, "Course name is too long.").validate(updateCourseClassInput.courseName);
    await yup.string().email("Monitor's email is invalid.").validate(updateCourseClassInput.emailClassMonitor);
    await yup
      .string()
      .oneOf(Object.values(CourseClassStatus), "Status is invalid.")
      .validate(updateCourseClassInput.status);

    await courseClassesService.updateClass(id, updateCourseClassInput, user.userId);

    return {
      message: "Course class updated successfully",
    };
  },

  deleteCourseClass: async (_, { id }, { user, courseClassesService }: AppContext) => {
    if (!user) {
      throw UnauthorizedError;
    }

    if (user.role !== UserRole.Lecturer) {
      throw PermissionError;
    }

    await courseClassesService.deleteClass(id, user.userId);

    return {
      message: "Course class deleted successfully",
    };
  },

  joinOpenCourseClass: async (_, { id }, { user, courseClassesService }: AppContext) => {
    if (!user) {
      throw UnauthorizedError;
    }

    if (user.role !== UserRole.Student) {
      throw PermissionError;
    }

    await courseClassesService.joinOpenClass(id, user.email);

    return {
      message: "Joined class successfully",
    };
  },

  leaveCourseClass: async (_, { id }, { user, courseClassesService }: AppContext) => {
    if (!user) {
      throw UnauthorizedError;
    }

    if (user.role !== UserRole.Student) {
      throw PermissionError;
    }

    await courseClassesService.leaveClass(id, user.email);

    return {
      message: "Left class successfully",
    };
  },
};

export default mutations;
