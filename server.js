require('dotenv').config();
const fileUpload = require('express-fileupload');
const express = require('express');

const app = express();

app.use(fileUpload());
app.use(express.json());

const morgan = require('morgan');
app.use(morgan('dev'));

const {
  mostrarUsuario,
  nuevoUsuario,
  loguearUsuario,
  validarUsuario,
} = require('./controladores/usuarios');
const {
  descargarArchivo,
  editarNombreA,
  eliminarArchivo,
  listar,
  subirArchivo,
} = require('./controladores/archivos');
const {
  nuevaCarpeta,
  editarNombreC,
  eliminarCarpeta,
  editarPermisos,
} = require('./controladores/carpetas');
const { propietario } = require('./middlewares/propietario');
const { PORT } = process.env;

//*****END POINTS USUARIOS  */
app.get('/usuarios/:id', mostrarUsuario);
// POST - /users - Crear un usuario pendiente de activar
app.post('/usuarios', nuevoUsuario);
// GET - /users/validate/:registrationCode - Validará un usuario recien registrado
app.get('/usuarios/validar/:registrationCode', validarUsuario);
// POST - /users/login - Hará el login de un usuario y devolverá el TOKEN
app.post('/usuarios/login', loguearUsuario);
// PUT - /users/:id/password - Editar la contraseña de un usuario
// Token obligatorio y mismo usuario
app.put('/usuarios/password');

/**END POINTS ARCHIVOS */

app.get('/file/:id_archivo', descargarArchivo);
app.put('/file/:id_archivo', editarNombreA);
app.delete('/file/:id_archivo', eliminarArchivo);
app.get('/folder/:id_carpeta', listar);
app.post('/file', propietario, subirArchivo);

/**END POINTS CARPETAS */
app.post('/folder/:nombre_carpeta', propietario, nuevaCarpeta);
app.put('/folder/editarNombre', propietario, editarNombreC);
app.put('/folder/editarPermisos', propietario, editarPermisos);
app.delete('/folder/:id_carpeta', propietario, eliminarCarpeta);

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
