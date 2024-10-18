import { AppDataSource } from "../data-source.js";
import { User } from "../entities/user.entity.js";

export class UsersRepo {
  async getUserByEmail(email: string): Promise<User | null> {
    return AppDataSource.getRepository(User).findOne({
      where: { email },
    });
  }

  async saveUser(user: User) {
    return AppDataSource.manager.save(user);
  }
}
