import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import * as yup from "yup";
import { User } from "../entities/user.entity";
import { MutationResolvers, UserRole } from "../generated/graphql";

const mutations: MutationResolvers = {
  signUp: async (_, { userInput }, { dataSources }) => {
    // Validate the user input
    await yup.string().required("Email is required").email("Email is invalid.").validate(userInput.email);
    await yup
      .string()
      .required("Full name is required.")
      .max(255, "Full name is too long.")
      .validate(userInput.fullName);
    await yup.string().min(6, "Password requires at least 6 characters.").validate(userInput.password);
    await yup
      .string()
      .required("Role is required.")
      .oneOf([UserRole.Lecturer, UserRole.Student])
      .validate(userInput.role);

    // Check if the user already exists
    const existingUser = await dataSources.usersRepo.getUserByEmail(userInput.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create a new user
    const user: User = new User();
    user.email = userInput.email;
    user.fullName = userInput.fullName;

    const hashedPassword = await hash(userInput.password, 10);
    user.password = hashedPassword;
    user.role = userInput.role;

    dataSources.usersRepo.createNewUser(user);

    return {
      message: "User created successfully",
    };
  },

  login: async (_, { email, password }, { dataSources }) => {
    // Validate input
    await yup.string().email("Email is invalid.").validate(email);
    await yup.string().min(6, "Password requires at least 6 characters").validate(password);

    // Check if the user exists
    const user: User = await dataSources.usersRepo.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the password is correct
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    // Sign a JWT token
    const token = sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    return {
      message: "Login successful",
      token,
    };
  },
  editProfile: async (_, { userUpdateInput }, { user, dataSources }) => {
    if (!user) {
      throw new Error("User unauthorized");
    }

    // Validate the user input
    await yup.string().max(255, "Full name is too long.").validate(userUpdateInput.fullName);

    const passwordValidator = yup.string().min(6, "Password requires at least 6 characters.");
    await passwordValidator.validate(userUpdateInput.oldPassword);
    await passwordValidator.validate(userUpdateInput.newPassword);

    const existingUser: User = await dataSources.usersRepo.getUserByEmail(user.email);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if the old password is correct
    const isPasswordCorrect = await compare(userUpdateInput.oldPassword, existingUser.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    // Check if the new password is different from the old password
    if (userUpdateInput.oldPassword === userUpdateInput.newPassword) {
      throw new Error("New password must be different from the old password");
    }

    // Update the user
    existingUser.fullName = userUpdateInput.fullName;

    const hashedPassword = await hash(userUpdateInput.newPassword, 10);
    existingUser.password = hashedPassword;

    dataSources.usersRepo.updateUser(existingUser);

    return {
      message: "Profile updated successfully",
    };
  },
};

export default mutations;
