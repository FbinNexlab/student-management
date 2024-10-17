import { User } from "../entities/user.entity";
import { User as UserDto } from "../generated/graphql";

export class UsersMapper {
  static toUserDto(user: User): UserDto {
    const userDto: UserDto = {
      email: user.email,
      fullName: user.fullName,
      id: user.id,
      role: user.role,
    };

    return userDto;
  }

  static toUser(userDto: UserDto): User {
    const user: User = new User();
    user.email = userDto.email;
    user.fullName = userDto.fullName;
    user.id = userDto.id
    user.role = userDto.role;

    return user;
  }
}
