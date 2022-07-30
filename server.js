require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

const { PORT } = process.env;

app.use((error, req, res, next) => {
  res
    .status(error.httpStatus || 500)
    .send({ status: "error", message: error.message });
});

app.use((req, res) => {
  res.status(404).send({ status: "error", message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://127.0.0.1: ${PORT}`);
});
