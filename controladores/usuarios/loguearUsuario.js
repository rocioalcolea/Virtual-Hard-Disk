'use strict';

const loguearUsuario = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    res.send({
      status: 'ok',
      message: 'Usuario logueado',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loguearUsuario;
