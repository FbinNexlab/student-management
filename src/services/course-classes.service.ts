import { CourseClass } from "../entities/course-class.entity";
import { PermissionError } from "../errors/auth.error";
import { CourseClassNotFoundError, UserNotFoundError } from "../errors/common.error";
import { CourseClassFilter, CourseClassStatus, UpdateCourseClassInput, UserRole } from "../generated/graphql";
import { CourseClassesRepo } from "../repos/course-classes.repo";
import { UsersRepo } from "../repos/users.repo";
import { CreateCourseClassInput } from "./../generated/graphql";

export class CourseClassesService {
  constructor(private courseClassesRepo: CourseClassesRepo, private usersRepo: UsersRepo) {}

  async createNewClass(createCourseClassInput: CreateCourseClassInput, lecturerEmail: string) {
    // Check if the class monitor exists
    const classMonitor = await this.usersRepo.getUserByEmail(createCourseClassInput.emailClassMonitor);
    if (!classMonitor || classMonitor.role !== UserRole.Student) {
      throw new Error("Monitor's email is invalid");
    }

    const lecturer = await this.usersRepo.getUserByEmail(lecturerEmail);
    if (!lecturer) {
      throw UserNotFoundError;
    }

    const courseClass = new CourseClass();
    courseClass.className = createCourseClassInput.className;
    courseClass.courseName = createCourseClassInput.courseName;
    courseClass.numberOfStudent = 0;
    courseClass.status = CourseClassStatus.Close;
    courseClass.lecturer = lecturer;
    courseClass.classMonitor = classMonitor;

    await this.courseClassesRepo.saveClass(courseClass);
  }

  async updateClass(classId: number, updateCourseClassInput: UpdateCourseClassInput, lecturerId: number) {
    const courseClass = await this.courseClassesRepo.getClassById(classId);
    if (!courseClass) {
      throw CourseClassNotFoundError;
    }

    if (courseClass.lecturer.id !== lecturerId) {
      throw PermissionError;
    }

    if (updateCourseClassInput.className) {
      courseClass.className = updateCourseClassInput.className;
    }

    if (updateCourseClassInput.courseName) {
      courseClass.courseName = updateCourseClassInput.courseName;
    }

    if (updateCourseClassInput.emailClassMonitor) {
      const classMonitor = await this.usersRepo.getUserByEmail(updateCourseClassInput.emailClassMonitor);
      if (!classMonitor || classMonitor.role !== UserRole.Student) {
        throw new Error("Monitor's email is invalid");
      }

      courseClass.classMonitor = classMonitor;
    }

    if (updateCourseClassInput.status) {
      courseClass.status = updateCourseClassInput.status;
    }

    await this.courseClassesRepo.saveClass(courseClass);
  }

  async deleteClass(classId: number, lecturerId: number) {
    const courseClass = await this.courseClassesRepo.getClassById(classId);
    if (!courseClass) {
      throw CourseClassNotFoundError;
    }

    if (courseClass.lecturer.id !== lecturerId) {
      throw PermissionError;
    }

    // Check the number of students in the class
    if (courseClass.numberOfStudent >= 5) {
      throw new Error("Can not delete, this class has more than 5 students");
    }

    await this.courseClassesRepo.deleteClass(classId);
  }

  async getLecturerClasses(lecturerId: number, filter: CourseClassFilter) {
    console.log("filter", filter);
    let courseClasses = await this.courseClassesRepo.getLecturerClasses(lecturerId);
    if (filter && filter.classMonitorName) {
      courseClasses = courseClasses.filter((courseClass) => courseClass.classMonitor.fullName === filter.classMonitorName);
    }

    if (filter && filter.className) {
      console.log("filter.className", filter.className);
      courseClasses = courseClasses.filter((courseClass) => courseClass.className === filter.className);
    }

    console.log("courseClasses", courseClasses);

    return courseClasses;
  }

  async getClassDetails(classId: number) {
    const courseClass = await this.courseClassesRepo.getClassById(classId);
    if (!courseClass) {
      throw CourseClassNotFoundError;
    }

    return courseClass;
  }
}
