import Dotenv from "dotenv";
import express from "express";
import { Redis } from "ioredis";
import { UserInput } from "./generated/graphql.js";
import { UsersRepo } from "./repos/users.repo.js";
import { JwtService } from "./services/jwt.service.js";
import { UsersService } from "./services/users.service.js";
var app = express();
var port = process.env.PORT || 3000;

Dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || "default",
});

// Verify token
const usersRepo = new UsersRepo();
const jwtService = new JwtService(redis);
const usersService = new UsersService(usersRepo, jwtService);

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Webhooks are running");
});

app.get("/auth", (request, response) => {
  // Extract token from request
  var autherizationHeader = request.get("Authorization");
  if (!autherizationHeader) {
    response.status(401).json({ message: "Authorization header is required" });
    return;
  }

  const token = autherizationHeader.replace("Bearer ", "");
  const jwtPayload = jwtService.verify(token);
  console.log("Payload: " + JSON.stringify(jwtPayload));

  // Return appropriate response to Hasura
  var hasuraVariables = {
    "X-Hasura-Role": jwtPayload.role.toLowerCase(),
    "X-Hasura-User-Id": String(jwtPayload.userId),
  };
  response.status(200).json(hasuraVariables);
});

app.post("/signup", async (request, response) => {
  const userInput: UserInput = request.body.input.userInput;
  if (!userInput) {
    response.status(400).json({ message: "Input is required" });
    return;
  }

  console.log("userInput", userInput);
  try {
    await usersService.signUp(userInput.email, userInput.fullName, userInput.password, userInput.role);
    response.status(200).json({ message: "User created successfully" });
  } catch (error) {
    response.status(400).json({ message: error.message });
    return;
  }
});

app.post("/login", async (request, response) => {
  const email = request.body.input.email;
  const password = request.body.input.password;

  if (!email || !password) {
    response.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const token = await usersService.login(email, password);
    response.status(200).json({ message: "Login successful", token });
  } catch (error) {
    response.status(401).json({ message: error.message });
  }
});

app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
