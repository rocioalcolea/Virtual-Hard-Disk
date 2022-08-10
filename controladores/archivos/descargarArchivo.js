'use strict';

const path = require('path');
const { buscarArchivoId } = require('../../baseDatos/archivos');

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

    //si es el propietario o si era un fichero público que lo descargue con su nombre 'real'
    if (idPropietario == descargar[0].id_usuario || descargar[0].publico)
      res.download(file, `${descargar[0].name_real}`);
  } catch (error) {
    next(error);
  }
};

module.exports = descargarArchivo;
