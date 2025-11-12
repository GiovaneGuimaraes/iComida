import * as express from "express";

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.json({ message: "API do package server funcionando!" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
