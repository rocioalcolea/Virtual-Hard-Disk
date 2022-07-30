'use strict';

// crear las tablas y añadir datos

// IMPORTANTE
// Ejecución: node./db/initDB.js

require('dotenv').config();
//const { formatDateToDB } = require('../helpers');

const getDB = require('./db');

let connection;

async function main() {
  try {
    //DEBUG
    //console.log(process.env.MYSQL_USER);

    connection = await getDB();

    // CREO LAS TABLAS
    console.log('Borrando las tablas...');

    await connection.query('DROP TABLE IF EXISTS archivos;');
    await connection.query('DROP TABLE IF EXISTS directorios;');
    await connection.query('DROP TABLE IF EXISTS usuarios;');

    // CREO LAS TABLAS
    console.log('Creando las tablas...');

    // Tabla usuarios
    await connection.query(`
    CREATE TABLE usuarios(
        id_usuario INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR (100),
        email VARCHAR (100) UNIQUE NOT NULL,
        password VARCHAR(512) NOT NULL,
        active BOOLEAN DEFAULT false,
        rol ENUM("admin","normal") DEFAULT "normal" NOT NULL,
        registrationCode VARCHAR (100),
        lastAuthUpdate DATETIME,
        registrationDate DATETIME,
        recoverCode VARCHAR(100)
        );
  `);

    // Tabla directorios
    await connection.query(`
    CREATE TABLE directorios(
        id_directorio INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR (100),
        publico BOOLEAN DEFAULT false,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
        )
   `);

    // Tabla archivos
    await connection.query(`
    CREATE TABLE archivos(
        id_archivo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR (100),
        publico BOOLEAN DEFAULT false,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
        id_directorio int not null,
        FOREIGN KEY (id_directorio) REFERENCES directorios(id_directorio)
        );
    `);

    /*  console.log('Creo usuario admin...');
    await connection.query(`
     INSERT INTO users(date, email, password, name, active, role)
     VALUES (
      "${formatDateToDB(new Date())}",
      "stefano.peraldini@hackaboss.com",
      SHA2("${process.env.ADMIN_PASSWORD}", 512),
      "Stefano Peraldini",
      true,
      "admin"
     )
     `); */
    /*     console.log('Creo usuario de prueba...');
    // FIXME: eliminar cuando tendremos implementada la creación de un usuario
    await connection.query(`
     INSERT INTO users(date, email, password, name, active)
     VALUES (
      "${formatDateToDB(new Date())}",
      "stefano.peraldini@gmail.com",
      SHA2("${process.env.USER_PASSWORD}", 512),
      "Stefano Peraldini",
      true
     )
     `); */
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    // libero la connección
    if (connection) {
      connection.release();
    }
    process.exit();
  }
}

main();
