import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../generated/graphql";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
