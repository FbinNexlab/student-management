import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CourseClassStatus } from "../enums/course-class-status.enum";

@Entity()
export class CourseClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "class_name" })
  className: string;

  @Column({ name: "course_name" })
  courseName: string;

  @Column({ name: "id_class_monitor" })
  idClassMonitor: string;

  @Column({ name: "number_of_student" })
  numberOfStudent: number;

  @Column({name: "status"})
  status: CourseClassStatus;
}
