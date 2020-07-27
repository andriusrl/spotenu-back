import { Request, Response } from "express";
import { GenreBusiness } from "../business/GenreBusiness";
import { TokenGenerator } from "../services/tokenGenerator";
import { HashGenerator } from "../services/hashGenerator";
import { IdGenerator } from "../services/idGenerator";
import { GenreDatabase } from "../data/GenreDatabase";
import { UserController } from "./UserController";
export class GenreController {
  private static GenreBusiness = new GenreBusiness(
    new GenreDatabase(),
    new HashGenerator(),
    new TokenGenerator(),
    new IdGenerator()
  );

  public async signupGenre(req: Request, res: Response) {
    try {
      await GenreController.GenreBusiness.signupGenre(
        req.body.name,
        (req.headers.Authorization || req.headers.authorization) as string
      );
      res.status(200).send({message: "Genero criado com sucesso"});
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.errno===1062?"Genero não foi criado, nome duplicado":err.message });
    }
  }

  public async getAllGenres(req: Request, res: Response) {
    try {
      const result = await GenreController.GenreBusiness.getAllGenres()
      res.status(200).send({genres: result})
    } catch(err) {
      res.status(err.errorCode || 400).send({message: err.message})
    }
  }
}
