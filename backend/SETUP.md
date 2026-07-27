# Backend — guía de instalación y réplica del entorno

Pasos para dejar el backend corriendo en una máquina nueva (ej. la laptop),
en el mismo estado que en el equipo donde se desarrolló.

## 1. Requisitos

- Java 21 (JDK). Verificar con `java -version`.
- MySQL Community Server 8.x (no MariaDB). No hace falta Maven instalado:
  el proyecto trae `mvnw` / `mvnw.cmd` (Maven Wrapper).

### Instalar MySQL Community Server (Windows)

1. Descargar el instalador desde el sitio oficial de MySQL
   (dev.mysql.com/downloads), eligiendo "MySQL Installer for Windows".
2. Durante la instalación, elegir el setup "Server only" o "Developer Default".
3. Definir una contraseña para el usuario `root` cuando lo pida el instalador
   (anotarla, se usa solo para crear la base y el usuario de la app).
4. Al terminar, MySQL queda corriendo como servicio de Windows en el puerto 3306.

## 2. Crear la base de datos y el usuario de la app

Abrir "MySQL Command Line Client" (o `mysql -u root -p` si `mysql` está en el
PATH) y ejecutar:

```sql
CREATE DATABASE yintrack_db CHARACTER SET utf8mb4;
CREATE USER 'yintrack_app'@'localhost' IDENTIFIED BY 'TU_PASSWORD_AQUI';
GRANT ALL PRIVILEGES ON yintrack_db.* TO 'yintrack_app'@'localhost';
FLUSH PRIVILEGES;
```

## 3. Configurar variables de entorno

`application.properties` ya tiene valores por defecto para desarrollo local
(ver `backend/src/main/resources/application.properties`), pero la
contraseña real de la base debe pasarse por variable de entorno, nunca
escribirse en el archivo. En PowerShell, antes de correr el backend:

```powershell
$env:DB_PASSWORD = "TU_PASSWORD_AQUI"
```

Todas las variables disponibles están documentadas (sin valores reales) en
`backend/src/main/resources/application.properties.example`.

## 4. Ejecutar migraciones y levantar el backend

Desde la carpeta `backend/`:

```powershell
.\mvnw.cmd spring-boot:run
```

Esto aplica automáticamente las migraciones de Flyway (`src/main/resources/db/migration`)
contra `yintrack_db`, incluyendo la carga de datos de prueba, y levanta la API
en `http://localhost:8080/api` (coincide con `VITE_API_URL` del frontend).

## 5. Usuarios de prueba cargados por el seed

| Rol      | Correo                  | Contraseña     |
|----------|-------------------------|----------------|
| ADMIN    | admin@yintrack.com      | Admin123!      |
| TECNICO  | tecnico1@yintrack.com   | Tecnico123!    |
| CLIENTE  | cliente1@yintrack.com   | Cliente123!    |

(Hay 4 técnicos y 10 clientes en total, mismas contraseñas por rol — ver
`V2__seed_data.sql`.)

## 6. Notas de diseño

- El folio de cada equipo (`equipos.folio`) se genera en el backend con el
  formato `YIN-<año>-<consecutivo de 6 dígitos>`.
- Un `equipo` genera exactamente un `ticket` (relación 1:1); el folio del
  equipo es el que se usa para la consulta pública `GET /tickets/{folio}`.
- La relación N:M del modelo es `usuarios` (rol técnico) ↔ `tickets`,
  resuelta con la tabla `tecnico_ticket`.
