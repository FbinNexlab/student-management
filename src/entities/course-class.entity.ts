import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CourseClassStatus } from "../generated/graphql";
import { User } from "./user.entity";

@Entity()
export class CourseClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "class_name" })
  className: string;

  @Column({ name: "course_name" })
  courseName: string;

  @Column({ name: "number_of_student" })
  numberOfStudent: number;

  @Column({ name: "status" })
  status: CourseClassStatus;

  @ManyToOne(() => User, (user) => user.monitorCourseClasses)
  @JoinColumn({ name: "id_class_monitor" })
  classMonitor: User;

  @ManyToOne(() => User, (user) => user.lecturerCourseClasses)
  @JoinColumn({ name: "id_lecturer" })
  lecturer: User;
}
  