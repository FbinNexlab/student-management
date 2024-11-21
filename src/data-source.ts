import Dotenv from "dotenv";
import { DataSource } from "typeorm";
import { CourseClass } from "./entities/course-class.entity.js";
import { User } from "./entities/user.entity.js";

Dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "postgres",
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "1234",
  database: process.env.POSTGRES_DB || "student_management",
  synchronize: false,
  logging: true,
  entities: [User, CourseClass],
  subscribers: [],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  schema: process.env.POSTGRES_SCHEMA || "public",
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
