'use strict';
const { generateError } = require('../../helpers');
const { subirArchivo } = require('../../baseDatos/archivos');

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
      console.log('todo ok');
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
