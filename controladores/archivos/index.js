'use strict';

const descargarArchivo = require('./descargarArchivo');
const editarNombreA = require('./editarNombreA');
const eliminarArchivo = require('./eliminarArchivo');
const listar = require('./listar');
const subirArchivo = require('./subirArchivo');
const editarPermisosA = require('./editarPermisosA');

module.exports = {
  descargarArchivo,
  editarNombreA,
  eliminarArchivo,
  listar,
  subirArchivo,
  editarPermisosA,
};
