import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export class UsersRepo {
  async getUserByEmail(email: string) {
    return AppDataSource.manager.findOneBy(User, { email });
  }

  async createNewUser(user: User) {
    return AppDataSource.manager.save(user);
  } 

  async updateUser(user: User) {
    return AppDataSource.manager.save(user);
  }
}
