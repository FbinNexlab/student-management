import * as yup from "yup";
import { AppContext } from "..";
import { MutationResolvers, UserRole } from "../generated/graphql";

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
      throw new Error("User unauthorized");
    }

    await usersService.logout(user.jti);

    return {
      message: "Logout successful",
    };
  },

  editProfile: async (_, { userUpdateInput }, { user, usersService }: AppContext) => {
    if (!user) {
      throw new Error("User unauthorized");
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
};

export default mutations;
