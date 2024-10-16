import * as Jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export class JwtService {
  async sign(payload: JwtPayload): Promise<string> {
    return Jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  }

  verify(token: string): JwtPayload {
    return Jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
  }
}
