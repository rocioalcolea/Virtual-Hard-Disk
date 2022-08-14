'use strict';

const path = require('path');
const { buscarArchivoId } = require('../../baseDatos/archivos');
const { generateError } = require('../../helpers');

const descargarArchivo = async (req, res, next) => {
  try {
    //recojo los datos
    const idPropietario = req.idPropietario;
    const { id_archivo } = req.params;
    const descargar = await buscarArchivoId(id_archivo);

    //creo la ruta donde se encuentra el fichero con nombre encriptado
    const file = path.join(
      `discoDuro`,
      `${descargar[0].id_usuario}`,
      `${descargar[0].name_encriptado}`
    );

    //si no es el propietario o si no era un fichero público que lance error
    if (
      idPropietario !== descargar[0].id_usuario &&
      descargar[0].publico === 0
    ) {
      throw generateError('El archivo no le pertenece y no es público', 400);
    }
    //descargar el fichero
    res.download(file, `${descargar[0].name_real}`);
  } catch (error) {
    next(error);
  }
};

module.exports = descargarArchivo;
