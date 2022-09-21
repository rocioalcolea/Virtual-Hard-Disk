'use strict';

// crear las tablas y añadir datos

// IMPORTANTE
// Ejecución: node./baseDatos/initDB.js

require('dotenv').config();

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
        nameUnique VARCHAR(100),
        publico BOOLEAN DEFAULT false,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
        )
   `);

    // Tabla archivos
    await connection.query(`
    CREATE TABLE archivos(
        id_archivo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name_encriptado VARCHAR (100),
        name_real VARCHAR(100),
        publico BOOLEAN DEFAULT false,
        id_usuario INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
        id_directorio int not null,
        FOREIGN KEY (id_directorio) REFERENCES directorios(id_directorio)
        );
    `);
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
