import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CourseClassStatus } from "../generated/graphql";

@Entity()
export class CourseClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "class_name" })
  className: string;

  @Column({ name: "course_name" })
  courseName: string;

  @Column({ name: "id_class_monitor" })
  idClassMonitor: number;

  @Column({ name: "id_lecturer" })
  idLecturer: number;

  @Column({ name: "number_of_student" })
  numberOfStudent: number;

  @Column({ name: "status" })
  status: CourseClassStatus;
}
