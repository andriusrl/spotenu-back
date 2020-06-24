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
    await super.getConnection().raw(`
        INSERT INTO ${this.tableName} (id, name)
        VALUES (
          '${genre.getId()}',
          '${genre.getName()}'
        )`);
  }
}
