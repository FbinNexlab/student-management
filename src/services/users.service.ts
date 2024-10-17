import { compare, hash } from "bcrypt";
import { User } from "../entities/user.entity";
import { User as UserDto, UserRole } from "../generated/graphql";
import { UsersMapper } from "../mappers/users.mapper";
import { UsersRepo } from "../repos/users.repo";
import { JwtPayload, JwtService } from "./jwt.service";

export class UsersService {
  constructor(private usersRepo: UsersRepo, private jwtService: JwtService) {}
  async signUp(email: string, fullName: string, password: string, role: UserRole) {
    // Check if the user already exists
    const existingUser = await this.usersRepo.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create a new user
    const user: User = new User();
    user.email = email;
    user.fullName = fullName;

    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    user.role = role;

    this.usersRepo.saveUser(user);
  }

  async login(email: string, password: string): Promise<string> {
    // Check if the user exists
    const user: User = await this.usersRepo.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the password is correct
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid password");
    }

    // Sign a JWT token
    const jwtPayload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.sign(jwtPayload);

    return token;
  }

  async logout(jti: string) {
    // Invalidate the token
    this.jwtService.invalidateToken(jti);
  }

  async getProfile(email: string): Promise<UserDto> {
    const user: User = await this.usersRepo.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    return UsersMapper.toUserDto(user);
  }

  async updateProfile(email: string, fullName: string, oldPassword: string, newPassword: string) {
    const existingUser: User = await this.usersRepo.getUserByEmail(email);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Update the user
    if (fullName) {
      existingUser.fullName = fullName;
    }

    if (oldPassword && newPassword) {
      // Check if the old password is correct
      const isPasswordCorrect = await compare(oldPassword, existingUser.password);
      if (!isPasswordCorrect) {
        throw new Error("Invalid password");
      }

      // Check if the new password is different from the old password
      if (oldPassword === newPassword) {
        throw new Error("New password must be different from the old password");
      }

      existingUser.password = await hash(newPassword, 10);
    }

    this.usersRepo.saveUser(existingUser);
  }
}
