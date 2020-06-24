export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private nickname: string,
    private password: string,
    private type: UserType,
    private description?: string | null,
    private status?: boolean | null
  ) { }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public getPassword(): string {
    return this.password;
  }

  public getType(): UserType {
    return this.type;
  }

  public getDescription(): string | null | undefined {
    return this.description;
  }

  public getStatus(): boolean | null | undefined {
    return this.status;
  }
}

export enum UserType {
  BAND = "BAND",
  PAYING = "PAYING",
  FREE = "FREE",
  ADMIN = "ADMIN"
}

export const  numberToBoolean = (input: number): boolean => {
  return input === 1 ? true : false
}

export const booleanToString = (input: boolean): string => {
  return input ? "1" : "0"
}
