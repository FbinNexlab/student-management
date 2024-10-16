import { hash } from "bcrypt";
import { User } from "../entities/user.entity";
import { MutationResolvers } from "../generated/graphql";
import { UserInputSchema } from "../validators/user-input.validator";

const mutations: MutationResolvers = {
  signUp: async (_, { userInput }, { dataSources }) => {
    // Check if the user already exists
    const existingUser = await dataSources.usersRepo.getUserByEmail(userInput.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Validate the user input
    try {
      await UserInputSchema.validate(userInput);
    } catch (err) {
      throw new Error(err.errors.join(", "));
    }

    // Create a new user
    const user: User = new User();
    user.email = userInput.email;
    user.fullName = userInput.fullName;

    const hashedPassword = await hash(userInput.password, 10);
    user.password = hashedPassword;
    user.role = userInput.role;
    return dataSources.usersRepo.createNewUser(user);
  },
};

export default mutations;
