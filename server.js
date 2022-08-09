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
  editarPermisosA,
} = require('./controladores/archivos');
const {
  nuevaCarpeta,
  editarNombreC,
  eliminarCarpeta,
  editarPermisosD,
  buscarCarpeta,
} = require('./controladores/carpetas');
const { propietario } = require('./middlewares/propietario');
const { PORT } = process.env;

//*****END POINTS USUARIOS  */
app.get('/usuarios/:idParametro', propietario, mostrarUsuario);
// Crea un usuario  y le deja pendiente de activar
app.post('/usuarios', nuevoUsuario);
// Valida un usuario recien registrado
app.get('/usuarios/validar/:registrationCode', validarUsuario);
// Loguea un usuario y devuelve el TOKEN
app.post('/usuarios/login', loguearUsuario);
// Edita la contraseña de un usuario
app.put('/usuarios/password');

/**END POINTS ARCHIVOS */

app.get('/file/:id_archivo', propietario, descargarArchivo);
app.put('/file/editarNombre/:id_archivo', propietario, editarNombreA);
app.put('/file/permisos/:id_archivo', propietario, editarPermisosA);
app.delete('/file/eliminar/:id_archivo', propietario, eliminarArchivo);
app.post('/file/subirArchivo/:id_carpeta', propietario, subirArchivo);
app.get('/folder/listar/:id_carpeta', propietario, listar);

/**END POINTS CARPETAS */
app.post('/folder/crearCarpeta/', propietario, nuevaCarpeta);
app.get('/folder/buscarCarpeta', propietario, buscarCarpeta);
app.put('/folder/editarNombre/:idCarpeta', propietario, editarNombreC);
app.put('/folder/editarPermisos/:idCarpeta', propietario, editarPermisosD);
app.delete('/folder/eliminarCarpeta/:idCarpeta', propietario, eliminarCarpeta);

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
