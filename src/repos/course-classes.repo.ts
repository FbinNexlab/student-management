import { AppDataSource } from "../data-source";
import { CourseClass } from "../entities/course-class.entity";

export class CourseClassesRepo {
  async getClassById(classId: number) {
    return AppDataSource.manager.findOneBy(CourseClass, { id: classId });
  }

  async saveClass(courseClass: CourseClass) {
    return AppDataSource.manager.save(courseClass);
  }

  async deleteClass(classId: number) {
    return AppDataSource.manager.delete(CourseClass, classId);
  }
}
