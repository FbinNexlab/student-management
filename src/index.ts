import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entities/user.entity";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  const users = await AppDataSource.manager.find(User);
  console.log(users);
  res.send("Express + TypeScript Server 12345");
});

app.listen(port, () => {
  console.log(`[server123]: Server is running at http://localhost:${port}`);
});
