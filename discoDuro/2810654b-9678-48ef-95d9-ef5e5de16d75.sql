#creamos la base de datos
CREATE DATABASE IF NOT EXISTS base_peliculas;

#seleccionar la base de datos
USE base_peliculas;

#creamos las tablas sin relacion

CREATE TABLE IF NOT EXISTS peliculas(
	id_pelicula INT NOT NULL,
    titulo VARCHAR (45) NOT NULL,
    anio DATE,
    nacionalidad VARCHAR(20),
    idioma VARCHAR(120),
    formato ENUM('BLANCO Y NEGRO', 'COLOR'),
    descripcion VARCHAR(210),
    resumen VARCHAR (255),
    observaciones VARCHAR(255),
    PRIMARY KEY(id_pelicula)
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS actores(
	id_actor INT NOT NULL,
    nombre VARCHAR(45) NOT NULL,
    nacionalidad VARCHAR(45),
    nombre_personaje VARCHAR(45),
    primary key (id_actor)
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS directores(
	id_director INT NOT NULL,
    nombre VARCHAR(45) NOT NULL,
    fecha_nacimiento DATE,
    pais_origen VARCHAR(120),
    primary key (id_director),
    peliculas_id_pelicula INT NOT NULL,
    constraint fkdirector_peliculas
    foreign key (peliculas_id_pelicula)
    REFERENCES peliculas(id_pelicula)
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS actores_peliculas(
	peliculas_id_pelicula INT NOT NULL,
    actores_id_actores INT NOT NULL,
    PRIMARY KEY (peliculas_id_pelicula, actores_id_actores),
    CONSTRAINT fkactor_peliculas_actor
    FOREIGN KEY (actores_id_actores)
    REFERENCES actores(id_actor),
	CONSTRAINT fkactor_actor_peliculas
    FOREIGN KEY (peliculas_id_pelicula)
    REFERENCES peliculas(id_pelicula)
)ENGINE=INNODB;

