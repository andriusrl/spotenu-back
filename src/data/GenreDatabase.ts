import { BaseDataBase } from "./BaseDatabase";
import { User, UserType, numberToBoolean, booleanToString } from "../model/User";
import { Genre } from "../model/Genre";

export class GenreDatabase extends BaseDataBase {
  protected tableName: string = "SpotenuGenre";

  private toModel(dbModel?: any): Genre | undefined {
    return (
      dbModel &&
      new Genre(
        dbModel.id,
        dbModel.name
      )
    );
  }

  public async createGenre(genre: Genre): Promise<void> {
    const result = await super.getConnection().raw(`
        INSERT INTO ${this.tableName} (id, name)
        VALUES (
          '${genre.getId()}',
          '${genre.getName()}'
        )`);
  }

  public async getGenres(): Promise<void> {
    const result = await super.getConnection().raw(`
        SELECT * FROM ${this.tableName};
    `)

    return result[0]
  }
}
