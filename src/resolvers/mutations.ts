import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import * as yup from "yup";
import { User } from "../entities/user.entity";
import { MutationResolvers, UserRole } from "../generated/graphql";

const mutations: MutationResolvers = {
  signUp: async (_, { userInput }, { dataSources }) => {
    // Check if the user already exists
    const existingUser = await dataSources.usersRepo.getUserByEmail(userInput.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Validate the user input
    await yup.string().email("Email is invalid.").validate(userInput.email);
    await yup.string().max(255, "Full name is too long.").validate(userInput.fullName);
    await yup.string().min(6, "Password requires at least 6 characters").validate(userInput.password);
    await yup.string().oneOf([UserRole.Lecturer, UserRole.Student]).validate(userInput.role);

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
    const token = sign({ id: user.id, email: user.email, fullName: user.fullName }, process.env.JWT_SECRET || "secret", {expiresIn: "1h"});

    return {
      message: "Login successful",
      token,
    };
  },
};

export default mutations;
