import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export class UsersRepo {
  async getUserByEmail(email: string): Promise<User | null> {
    return AppDataSource.manager.findOneBy(User, { email });
  }

  async saveUser(user: User) {
    return AppDataSource.manager.save(user);
  }
}
