import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CourseClassStatus } from "../generated/graphql";
import { User } from "./user.entity";

@Entity()
export class CourseClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  className: string;

  @Column()
  courseName: string;

  @Column()
  numberOfStudent: number;

  @Column()
  status: CourseClassStatus;

  @ManyToOne(() => User, (user) => user.monitorCourseClasses)
  @JoinColumn()
  classMonitor: User;

  @ManyToOne(() => User, (user) => user.lecturerCourseClasses)
  @JoinColumn()
  lecturer: User;

  @ManyToMany (() => User, (user) => user.studentCourseClasses, { cascade: true })
  @JoinTable()
  students: User[];
}
