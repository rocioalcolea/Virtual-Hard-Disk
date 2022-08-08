'use strict';

const { mostrarFicheros } = require('../../baseDatos/archivos');

const listar = async (req, res, next) => {
  //RECORDAR LISTAR TAMBIEN LOS DIRECTORIOS, NO SOLO LOS FICHEROS!!!!!!
  try {
    //recojo id de parametro
    const { id_carpeta } = req.params;
    const idUsuario = req.idPropietario;

    //llamo a la funcion que devuelve los datos de la base de datos
    const archivos = await mostrarFicheros(id_carpeta, idUsuario);

    res.send({
      status: 'ok',
      message: 'Listar Archivos',
      data: [...archivos],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = listar;
