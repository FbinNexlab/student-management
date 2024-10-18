import { AppDataSource } from "../data-source.js";
import { CourseClass } from "../entities/course-class.entity.js";
import { User } from "../entities/user.entity.js";
import { CourseClassStatus } from "../generated/graphql.js";

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

  async getStudentClasses(studentId: number) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: studentId },
      relations: { studentCourseClasses: true },
    });

    return user.studentCourseClasses;
  }

  async getOpenClasses() {
    return AppDataSource.manager.find(CourseClass, {
      where: { status: CourseClassStatus.Open },
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
