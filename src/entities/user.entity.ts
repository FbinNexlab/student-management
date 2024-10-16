import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../generated/graphql";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  role: UserRole;
}
