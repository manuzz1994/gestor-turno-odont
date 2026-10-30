CREATE TABLE IF NOT EXISTS doctor (
  id INT NOT NULL AUTO_INCREMENT,
  dni INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_doctor_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS paciente (
  id INT NOT NULL AUTO_INCREMENT,
  dni INT NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_paciente_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS turno (
  id INT NOT NULL AUTO_INCREMENT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  observaciones VARCHAR(200) DEFAULT NULL,
  id_doctor INT NOT NULL,
  id_paciente INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_turno_doctor_fecha_hora (id_doctor, fecha, hora),
  KEY fk_turno_paciente (id_paciente),
  CONSTRAINT fk_turno_doctor FOREIGN KEY (id_doctor) REFERENCES doctor (id) ON DELETE CASCADE,
  CONSTRAINT fk_turno_paciente FOREIGN KEY (id_paciente) REFERENCES paciente (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
