
import express from "express";
import {AddressInfo} from "net";
import { userRouter } from "./router/UserRouter";
import { genreRouter } from "./router/GenreRouter";
import cors from "cors";

const app = express();

app.use(cors())

app.use(express.json());

app.use("/users/", userRouter);

app.use("/genre/", genreRouter)


const server = app.listen(3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});