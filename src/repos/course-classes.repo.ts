import { AppDataSource } from "../data-source";
import { CourseClass } from "../entities/course-class.entity";

export class CourseClassesRepo {
  async saveClass(courseClass: CourseClass) {
    return AppDataSource.manager.save(courseClass);
  }
}
