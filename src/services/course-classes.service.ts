import { CourseClass } from "../entities/course-class.entity";
import { CourseClassStatus, UserRole } from "../generated/graphql";
import { CourseClassesRepo } from "../repos/course-classes.repo";
import { UsersRepo } from "../repos/users.repo";
import { CreateCourseClassInput } from "./../generated/graphql";

export class CourseClassesService {
  constructor(private courseClassesRepo: CourseClassesRepo, private usersRepo: UsersRepo) {}

  async createNewClass(createCourseClassInput: CreateCourseClassInput, lecturerId: number) {
    // Check if the class monitor exists
    const classMonitor = await this.usersRepo.getUserByEmail(createCourseClassInput.emailClassMonitor);
    if (!classMonitor || classMonitor.role !== UserRole.Student) {
      throw new Error("Monitor's email is invalid");
    }

    const courseClass = new CourseClass();
    courseClass.className = createCourseClassInput.className;
    courseClass.courseName = createCourseClassInput.courseName;
    courseClass.idClassMonitor = classMonitor.id;
    courseClass.numberOfStudent = 0;
    courseClass.status = CourseClassStatus.Close;
    courseClass.idLecturer = lecturerId;

    await this.courseClassesRepo.saveClass(courseClass);
  }

  async deleteClass(classId: number) {
    const courseClass = await this.courseClassesRepo.getClassById(classId);
    if (!courseClass) {
      throw new Error("Class not found");
    }
    
    // Check the number of students in the class
    if (courseClass.numberOfStudent >= 5) {
      throw new Error("Can not delete, this class has more than 5 students");
    }
    
    await this.courseClassesRepo.deleteClass(classId);
  }
}
