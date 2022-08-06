'use strict';

const { generateError } = require('../../helpers');
const { subirArchivo } = require('../../baseDatos/archivos');
const { v4: uuidv4 } = require('uuid');

const path = require('path');

const subirFichero = async (req, res, next) => {
  try {
    const idUsuario = req.idPropietario;
    const { nombreCarpeta } = req.body;

    const { fichero } = req.files;

    if (!fichero) {
      throw generateError('El fichero no existe', 400);
    }
    const extension = path.extname(fichero.name);

    const nombreEncriptado = `${uuidv4()}${extension}`;

    const id = await subirArchivo(
      idUsuario,
      fichero.name,
      nombreEncriptado,
      nombreCarpeta
    );

    if (id) {
      await fichero.mv(
        path.join(
          __dirname,
          `..`,
          `..`,
          `discoDuro`,
          `${idUsuario}`,
          `${nombreEncriptado}`
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
