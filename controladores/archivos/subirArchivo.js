'use strict';

const { generateError } = require('../../helpers');
const { subirArchivo } = require('../../baseDatos/archivos');
const { v4: uuidv4 } = require('uuid');

const path = require('path');

const subirFichero = async (req, res, next) => {
  try {
    //recojo los datos
    const idUsuario = req.idPropietario;
    const { id_carpeta } = req.params;
    const { fichero } = req.files;

    //compruebo que se ha adjuntado archivo
    if (!fichero) {
      throw generateError('El fichero no existe', 400);
    }

    //encripto el nombre para que no haya conflicto en el servidor
    const nombreEncriptado = `${uuidv4()}${path.extname(fichero.name)}`;

    //llamo a la funcion que actualiza la base de datos
    const id = await subirArchivo(
      idUsuario,
      id_carpeta,
      fichero.name,
      nombreEncriptado
    );

    //añado el fichero al servidor
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
