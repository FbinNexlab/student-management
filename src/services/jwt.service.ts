import { Redis } from "ioredis";
import Jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";  

export interface JwtPayload extends Jwt.JwtPayload {
  userId: number;
  email: string;
  role: string;
}

const INVALIDATED = "invalidated";
export class JwtService {
  constructor(private redisClient: Redis) {}
  async sign(payload: JwtPayload): Promise<string> {
    // Add a unique identifier to the JWT payload
    payload.jti = uuidv4();
    return Jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: 3600,
    });
  }

  verify(token: string): JwtPayload {
    return Jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
  }

  invalidateToken(jti: string) {
    // Add the token to the blacklist
    this.redisClient.set(jti, INVALIDATED, "EX", process.env.JWT_EXPIRES_IN || 3600);
  }

  async isTokenInvalidated(jti: string): Promise<boolean> {
    // Check if the token is in the blacklist
    const result = await this.redisClient.get(jti);
    return result === INVALIDATED;
  }
}
