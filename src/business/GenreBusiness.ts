import { GenreDatabase } from "../data/GenreDatabase";
import { Genre } from "../model/Genre";
import { IdGenerator } from "../services/idGenerator";
import { HashGenerator } from "../services/hashGenerator";
import { TokenGenerator } from "../services/tokenGenerator";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { GenericError } from "../errors/GenericError";
import { UserType } from "../model/User";

export class GenreBusiness {
  constructor(
    private genreDatabase: GenreDatabase,
    private hashGenerator: HashGenerator,
    private tokenGenerator: TokenGenerator,
    private idGenerator: IdGenerator
  ) { }

  public async signupGenre(
    name: string,
    authorization: string
  ) {

    if (this.tokenGenerator.verify(authorization).type !== UserType.ADMIN) {
      throw new GenericError("Você não é um usuário administrador")
    }

    if (!name) {
      throw new InvalidParameterError("Missing input");
    }

    const id = this.idGenerator.generate();
    await this.genreDatabase.createGenre(
      new Genre(id, name)
    );
  }

  public async getAllGenres() {
    const result = await this.genreDatabase.getGenres()
    return result
  }
}