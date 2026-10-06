# Gestor de turnos - consultorio odontológico

## Qué es
App web para gestionar los turnos de un consultorio odontológico. Sin login ni usuarios: una sola página donde se dan de alta doctores y pacientes y se crean turnos entre los que ya existen en la base.

## Stack
- Frontend: Angular (TypeScript)
- Backend: Express
- Base de datos: MySQL (base `consultorio`, script en `schema.sql`)

## Funcionalidad
- CRUD (alta, baja, modificación) de doctores, pacientes y turnos.
- Ventana principal: calendario mensual. Cada turno aparece en su día con la hora y el nombre del paciente.
- Al hacer clic en un turno se abre una card con los datos del paciente: nombre, apellido, DNI y teléfono.

## Modelo de datos
```
doctor / paciente (mismas columnas)
  id        INT  PK AUTO_INCREMENT
  dni       INT  UNIQUE NOT NULL
  nombre    VARCHAR(50) NOT NULL
  apellido  VARCHAR(50) NOT NULL
  telefono  VARCHAR(20) NOT NULL

turno
  id             INT  PK AUTO_INCREMENT
  fecha          DATE NOT NULL
  hora           TIME NOT NULL
  observaciones  VARCHAR(200)
  id_doctor      INT NOT NULL  FK -> doctor(id)    ON DELETE CASCADE
  id_paciente    INT NOT NULL  FK -> paciente(id)  ON DELETE CASCADE
  UNIQUE (id_doctor, fecha, hora)
```
Restricciones con nombre: `uq_doctor_dni`, `uq_paciente_dni`, `uq_turno_doctor_fecha_hora`, `fk_turno_doctor`, `fk_turno_paciente`.

## Reglas de negocio
- Un doctor no puede tener dos turnos a menos de 60 minutos entre sí el mismo día (si tiene uno a las 18:00, no puede tener otro a las 18:30). Se valida en el backend antes de cada INSERT y de cada UPDATE de fecha u hora; si hay conflicto se responde 409. El `UNIQUE` de la base solo cubre la hora exacta.
- Borrar un doctor o un paciente borra sus turnos (CASCADE). El frontend debe pedir confirmación antes de eliminar.
- Las fechas se guardan como `YYYY-MM-DD`; el formato `DD/MM/YY` se aplica solo al mostrar, en Angular.
- El teléfono es texto, no número.

## Estado actual
- Modelo de datos definido (`schema.sql`).
- Siguiente paso: crear el proyecto de Express y conectarlo a MySQL.

## Convenciones
- Nombres de tablas y columnas en español, en singular y en minúscula.
- Respuestas y comentarios en español.