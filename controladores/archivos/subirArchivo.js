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

    if (!fichero) {
      throw generateError('El fichero no existe', 400);
    }

    const id = await subirArchivo(idUsuario, fichero.name, nombreCarpeta);
    if (nombreCarpeta == undefined) {
      if (id) {
        await fichero.mv(
          path.join(
            __dirname,
            `..`,
            `..`,
            `discoDuro`,
            `${idUsuario}`,
            `root<>${fichero.name}`
          )
        );
      }
    } else {
      await fichero.mv(
        path.join(
          __dirname,
          `..`,
          `..`,
          `discoDuro`,
          `${idUsuario}`,
          `${nombreCarpeta}<>${fichero.name}`
        )
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
