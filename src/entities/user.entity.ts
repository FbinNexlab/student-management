import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../generated/graphql";
import { CourseClass } from "./course-class.entity";

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

  @OneToMany(() => CourseClass, (courseClass) => courseClass.lecturer)
  lecturerCourseClasses: CourseClass[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.classMonitor)
  monitorCourseClasses: CourseClass[];

  @ManyToMany(() => CourseClass, (courseClass) => courseClass.students)
  studentCourseClasses: CourseClass[];
}
