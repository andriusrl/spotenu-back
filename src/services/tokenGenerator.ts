import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserType } from "../model/User";
dotenv.config();

export class TokenGenerator {
  private static expiresIn: string = "369636m";

  public generate = (input: AuthenticationData): string => {
    const newToken = jwt.sign(
      {
        id: input.id,
        type: input.type ? input.type : UserType.FREE
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: TokenGenerator.expiresIn,
      }
    );
    console.log(this.verify(newToken))
    return newToken;
  };

  public verify(token: string) {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    const result = { id: payload.id, type: payload.type };
    return result;
  }
}

export interface AuthenticationData {
  id: string;
  type?: UserType;
}
