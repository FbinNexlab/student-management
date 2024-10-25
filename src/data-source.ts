import Dotenv from "dotenv";
import { DataSource } from "typeorm";
import { CourseClass } from "./entities/course-class.entity.js";
import { User } from "./entities/user.entity.js";

Dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  synchronize: false,
  logging: true,
  entities: [User, CourseClass],
  subscribers: [],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  schema: process.env.DB_SCHEMA || "public",
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
