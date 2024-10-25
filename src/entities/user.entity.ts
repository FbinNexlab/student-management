import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../generated/graphql.js";
import { CourseClass } from "./course-class.entity.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: "full_name" })
  fullName: string;

  @Column()
  role: UserRole;

  @OneToMany(() => CourseClass, (courseClass) => courseClass.lecturer)
  lecturerCourseClasses: CourseClass[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.classMonitor)
  monitorCourseClasses: CourseClass[];

  @ManyToMany(() => CourseClass, (courseClass) => courseClass.students)
  studentCourseClasses: CourseClass[];
}
