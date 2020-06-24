import { BaseDataBase } from "./BaseDatabase";
import { User, UserType, numberToBoolean, booleanToString } from "../model/User";

export class UserDatabase extends BaseDataBase {
  protected tableName: string = "SpotenuUsers";

  private toModel(dbModel?: any): User | undefined {
    return (
      dbModel &&
      new User(
        dbModel.id,
        dbModel.name,
        dbModel.email,
        dbModel.nickname,
        dbModel.password,
        dbModel.type,
        dbModel.description,
        numberToBoolean(dbModel.status)
      )
    );
  }

  public async createUser(user: User): Promise<void> {
    await super.getConnection().raw(`
        INSERT INTO ${this.tableName} (id, name, email, nickname, description, status, password, type)
        VALUES (
          '${user.getId()}',
          '${user.getName()}',
          '${user.getEmail()}', 
          '${user.getNickname()}',
          '${user.getDescription()}', 
          '${booleanToString(user.getStatus() as boolean)}', 
          '${user.getPassword()}', 
          '${user.getType()}'
        )`);
  }

  public async getUsers(type: UserType): Promise<User[]> {
    const result = await super.getConnection().raw(`
       SELECT * FROM ${this.tableName} WHERE type = "${type}";
    `)
    return result[0].map(user => {
      return new User(
        user.id,
        user.name,
        user.email,
        user.nickname,
        user.password,
        user.type,
        user.description,
        numberToBoolean(user.status)
      )
    })
  }

  public async setStatus(status: boolean, email: string): Promise<void> {
    await super.getConnection().raw(`
    UPDATE SpotenuUsers SET status = "${booleanToString(status)}" WHERE email = "${email}";
    `)
  }

  public async getUserByEmailOrNickname(emailOrNickname: string): Promise<User | undefined> {
    let result = await super.getConnection().raw(`
      SELECT * from ${this.tableName} WHERE email = '${emailOrNickname}'
      `);
    if (!result[0][0]) {
      result = await super.getConnection().raw(`
      SELECT * from ${this.tableName} WHERE nickname = '${emailOrNickname}'
      `);
    }
    return this.toModel(result[0][0]);
  }

  public async getUserById(id: string): Promise<User | undefined> {
    const result = await super.getConnection().raw(`
      SELECT * from ${this.tableName} WHERE id = '${id}'
      `);
    return this.toModel(result[0][0]);
  }

  public async getAllUsers(): Promise<User[]> {
    const result = await super.getConnection().raw(`
      SELECT * from ${this.tableName}
    `);
    return result[0].map((res: any) => {
      return this.toModel(res);
    });
  }
}
