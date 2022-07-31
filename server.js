require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());

const morgan = require('morgan');
app.use(morgan('dev'));

const { mostrarUsuario } = require('./gestion/usuarios/');
const {
  descargarArchivo,
  editarNombreA,
  eliminarArchivo,
  listar,
  subirArchivo,
} = require('./gestion/archivos');

const { PORT } = process.env;

//*****END POINTS */
app.get('/usuarios/:id', mostrarUsuario);

/**END POINTS ARCHIVOS */

app.get('/file//:id_archivo', descargarArchivo);
app.put('/file/:id_archivo', editarNombreA);
app.delete('/file/:id_archivo', eliminarArchivo);
app.get('/folder', listar);
app.post('/file/:nombre_archivo', subirArchivo);

app.use((error, req, res, next) => {
  res
    .status(error.httpStatus || 500)
    .send({ status: 'error', message: error.message });
});

app.use((req, res) => {
  res.status(404).send({ status: 'error', message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://127.0.0.1: ${PORT}`);
});
