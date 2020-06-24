import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { TokenGenerator } from "../services/tokenGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { HashGenerator } from "../services/hashGenerator";
import { IdGenerator } from "../services/idGenerator";
export class UserController {
  private static UserBusiness = new UserBusiness(
    new UserDatabase(),
    new HashGenerator(),
    new TokenGenerator(),
    new IdGenerator()
  );

  async signupListener(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.signupListener(
        req.body.name,
        req.body.email,
        req.body.nickname,
        req.body.password
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  async signupAdmin(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.signupAdmin(
        req.body.name,
        req.body.email,
        req.body.nickname,
        req.body.password,
        req.headers.authorization as string
      );
      res.status(200).send({message: `Usuário ${req.body.name} cadastrado como admin`});
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  async signupBand(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.signupBand(
        req.body.name,
        req.body.email,
        req.body.nickname,
        req.body.description,
        req.body.password,
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async login(req: Request, res: Response) {
    const emailOrNickname = req.body.emailOrNickname;
    const password = req.body.password;
    try {
      const result = await UserController.UserBusiness.login(emailOrNickname, password);
      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getAllBands(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.getAllBands(req.headers.authorization as string)

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({message: err.message})
    }
  }

  public async aproveBand(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.aproveBand(req.headers.authorization as string, true, req.body.email)

      res.status(200).send({message: "Banda aprovada com sucesso"})
    } catch(err) {
      res.status(err.errorCode || 400).send({message: err.message})
    }
  }
}
