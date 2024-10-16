import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export class UsersRepo {
  async getUserById(id: number) {
    return AppDataSource.manager.findOneBy(User, { id });
  }

  async createNewUser(user: User) {
    return AppDataSource.manager.save(user);
  } 
}
