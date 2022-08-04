'use strict';

const { generateError } = require('../../helpers');
const { subirArchivo } = require('../../baseDatos/archivos');
//const fs = require('fs').promises;

const path = require('path');

const subirFichero = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { nombreCarpeta } = req.body;
    const { fichero } = req.files;
    console.log(fichero);
    if (!nombreCarpeta || !fichero) {
      throw generateError('La carpeta o el fichero no existen', 400);
    }

    const id = await subirArchivo(idUsuario, fichero.name, nombreCarpeta);

    if (id) {
      await fichero.mv(
        path.join(__dirname, `/../../discoDuro/${idUsuario}/${fichero.name}`)
      );
    }
    res.send({
      status: 'ok',
      message: 'Subir Archivo',
      data: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = subirFichero;
