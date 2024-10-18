import { AppDataSource } from "../data-source";
import { CourseClass } from "../entities/course-class.entity";

export class CourseClassesRepo {
  async getClassById(classId: number) {
    return AppDataSource.manager.findOne(CourseClass, {
      where: { id: classId },
      relations: {
        classMonitor: true,
        students: true,
        lecturer: true,
      },
    });
  }

  async getLecturerClasses(lecturerId: number) {
    return AppDataSource.manager.find(CourseClass, {
      where: { lecturer: { id: lecturerId } },
      relations: {
        classMonitor: true,
        students: true,
        lecturer: true,
      },
    });
  }

  async saveClass(courseClass: CourseClass) {
    return AppDataSource.manager.save(courseClass);
  }

  async deleteClass(classId: number) {
    return AppDataSource.manager.delete(CourseClass, classId);
  }
}
