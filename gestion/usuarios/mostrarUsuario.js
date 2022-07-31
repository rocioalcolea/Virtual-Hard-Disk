'use strict';

const getDB = require('../../baseDatos/db');

const mostrarUsuario = async (req, res, next) => {
  let connection;
  try {
    // pido conneción al DB
    connection = await getDB();

    // recojo id del usuario de lo que quiero info
    const { id } = req.params;

    // leer todas las informaciones del usuario

    const [usuario] = await connection.query(
      `
          SELECT id_usuario, name, email, password, active, rol, registrationDate
          FROM usuarios
          WHERE id_usuario=?
          `,
      [id]
    );

    console.log('usuario:', usuario[0]);

    // creo un objeto con la información del usuario
    const infoUsuario = {
      nombre: usuario[0].name,
      mail: usuario[0].email,
    };

    // Dejo comentado para ver que lo que llega por req.params
    // siempre es un string
    //console.log('>>>>>', req.userAuth.id, id, req.userAuth.role);

    // si el usuario coincide con lo del token o
    // es admin añadir al objeto más informaciones
    /*     if (req.userAuth.id === user[0].id || req.userAuth.role === 'admin') {
      userInfo.id = user[0].id;
      userInfo.date = user[0].date;
      userInfo.email = user[0].email;
      userInfo.role = user[0].role;
    } */

    // invio info user

    res.send({
      status: 'ok',
      message: 'Mostrar usuario',
      data: infoUsuario,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = mostrarUsuario;
