import { UserDatabase } from "../data/UserDatabase";
import { User, UserType } from "../model/User";
import { IdGenerator } from "../services/idGenerator";
import { HashGenerator } from "../services/hashGenerator";
import { TokenGenerator } from "../services/tokenGenerator";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { GenericError } from "../errors/GenericError";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private hashGenerator: HashGenerator,
    private tokenGenerator: TokenGenerator,
    private idGenerator: IdGenerator
  ) { }

  public async signupListener(
    name: string,
    email: string,
    nickname: string,
    password: string
  ) {
    if (!name || !email || !nickname || !password) {
      throw new InvalidParameterError("Missing input");
    }

    if (email.indexOf("@") === -1) {
      throw new InvalidParameterError("Invalid email");
    }

    if (password.length < 6) {
      throw new InvalidParameterError("Invalid password");
    }

    const id = this.idGenerator.generate();
    const cryptedPassword = await this.hashGenerator.hash(password);

    await this.userDatabase.createUser(
      new User(id, name, email, nickname, cryptedPassword, UserType.FREE)
    );

    const accessToken = this.tokenGenerator.generate({
      id
    });
    return { accessToken };
  }

  public async signupAdmin(
    name: string,
    email: string,
    nickname: string,
    password: string,
    Authorization: string
  ) {
    console.log("Teste1")
    if (this.tokenGenerator.verify(Authorization).type !== UserType.ADMIN) {
      throw new GenericError("Você não é um usuário administrador")
    }
    console.log("Teste2")
    if (!name || !email || !nickname || !password) {
      console.log(name)
      console.log(email)
      console.log(nickname)
      console.log(password)
      console.log("2.5")
      throw new InvalidParameterError("Missing input");
    }
    console.log("Teste3")
    if (email.indexOf("@") === -1) {
      throw new InvalidParameterError("Invalid email");
    }
    console.log("Teste4")
    if (password.length < 10) {
      throw new InvalidParameterError("Invalid password");
    }
    console.log("quase la")
    const id = this.idGenerator.generate();
    const cryptedPassword = await this.hashGenerator.hash(password);
    console.log("finaol")
    await this.userDatabase.createUser(
      new User(id, name, email, nickname, cryptedPassword, UserType.ADMIN)
    );
  }

  public async signupBand(
    name: string,
    email: string,
    nickname: string,
    description: string,
    password: string
  ) {

    if (!name || !email || !nickname || !password) {
      throw new InvalidParameterError("Missing input");
    }

    if (email.indexOf("@") === -1) {
      throw new InvalidParameterError("Invalid email");
    }

    if (password.length < 6) {
      throw new InvalidParameterError("Invalid password");
    }

    const id = this.idGenerator.generate();
    const cryptedPassword = await this.hashGenerator.hash(password);

    await this.userDatabase.createUser(
      new User(id, name, email, nickname, cryptedPassword, UserType.BAND, description, false)
    );

    return { message: `Cadastro da banda ${nickname} feito com sucesso` };

  }

  public async login(emailOrNickname: string, password: string) {
    if (!emailOrNickname || !password) {
      throw new InvalidParameterError("Missing input");
    }

    const user = await this.userDatabase.getUserByEmailOrNickname(emailOrNickname);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordCorrect = await this.hashGenerator.compareHash(
      password,
      user.getPassword()
    );

    if (!isPasswordCorrect) {
      throw new InvalidParameterError("Invalid password");
    }

    let type = UserType.FREE

    if (user.getType() === UserType.ADMIN) {
      type = UserType.ADMIN
    }

    const accessToken = this.tokenGenerator.generate({
      id: user.getId(),
      type
    });

    return { accessToken };
  }

  public async getAllBands(Authorization: string) {
    if (this.tokenGenerator.verify(Authorization).type !== UserType.ADMIN) {
      throw new GenericError("Você não é um usuário administrador")
    }
    const result = await this.userDatabase.getUsers(UserType.BAND)
    const resultMap = result.map(band => {
      return {
        name: band.getName(),
        email: band.getEmail(),
        nickname: band.getNickname(),
        status: band.getStatus()
      }
    })
    return resultMap
  }

  public async aproveBand(Authorization: string, status: boolean, email) {
    if (this.tokenGenerator.verify(Authorization).type !== UserType.ADMIN) {
      throw new GenericError("Você não é um usuário administrador")
    }
    const band = await this.userDatabase.getUserByEmailOrNickname(email)
    if (!band) {
      throw new GenericError("Essa banda não existe")
    } else if (band.getStatus() !== true) {
      const result = await this.userDatabase.setStatus(status, email)
      return result
    } else {
      throw new GenericError("Essa banda já está aprovada")
    }

  }
}