# Acceso remoto a MySQL para SGICS

Esta guía explica cómo permitir conexiones remotas a la base MySQL que usas con SGICS, ya sea:
- MySQL en Docker (docker-compose.dev.yml de este repo)
- MySQL externo (cPanel/phpMyAdmin en tu hosting)

Requisitos previos:
- Usuario con permisos para crear usuarios y otorgar GRANTs en MySQL
- Conocer la IP/host desde donde se conectará Django u otros clientes

## Opción A: MySQL en Docker (local)

1) Verifica que el servicio expone el puerto 3306 y escucha en 0.0.0.0. En `IngSw-seccion1/docker-compose.dev.yml` ya está:
- `ports: - "3306:3306"`
- `--default-authentication-plugin=mysql_native_password`

2) Levanta la base:
- Usa Docker Desktop o `docker compose up -d db`
- Comprueba salud: `docker compose ps` (estado healthy) y `docker logs <container_db>` si falla

3) Crea un usuario con acceso remoto y permisos (desde el contenedor o cualquier cliente con permisos):

Ejecuta el SQL de `codigo/backend/db/mysql_remote_grants.sql` o manualmente:

```
CREATE USER IF NOT EXISTS 'sgics_user'@'%' IDENTIFIED BY 'sgics_pass';
GRANT ALL PRIVILEGES ON `sgics_dev`.* TO 'sgics_user'@'%';
FLUSH PRIVILEGES;
```

4) Firewall de Windows (si conectarás desde otra máquina):
- Abre el puerto TCP 3306 en Entrada para tu red confiable
- Alternativa segura: no expongas 3306 y usa túnel VPN/SSH

Parámetros para conectar:
- HOST: IP de tu PC (o `localhost` si es la misma máquina)
- PORT: 3306
- USER: sgics_user
- PASSWORD: sgics_pass
- DB: sgics_dev

## Opción B: MySQL remoto (phpMyAdmin/hosting)

1) Habilita acceso remoto en el hosting (cPanel: Remote MySQL):
- Agrega la IP pública del servidor donde corre Django (evita `0.0.0.0/0` en producción)

2) Crea el usuario y otorga permisos (phpMyAdmin > SQL):

```
CREATE USER 'sgics_user'@'%' IDENTIFIED BY 'sgics_pass';
GRANT ALL PRIVILEGES ON `volbiobio_SGICS`.* TO 'sgics_user'@'%';
FLUSH PRIVILEGES;
```

Nota: Algunos hostings exigen IP fija: `'sgics_user'@'X.Y.Z.W'`

3) Datos de conexión para Django/cliente:
- HOST: `mysql.tu-dominio.com` o IP del hosting
- PORT: 3306 (o el que indique el proveedor)
- USER/PASSWORD: credenciales creadas
- DATABASE: `volbiobio_SGICS` (o el nombre que uses)

## Comprobación rápida

- CLI: `mysql -h <HOST> -P <PORT> -u sgics_user -p`
- GUI: DBeaver/TablePlus con los mismos parámetros

Si falla:
- Verifica lista blanca de IPs (Remote MySQL)
- Asegura que el usuario se creó para el host correcto (no sólo `'localhost'`)
- Revisa firewall/red y que el puerto 3306 esté abierto

## Django: variables de entorno ejemplo

```
DB_ENGINE=django.db.backends.mysql
DB_NAME=volbiobio_SGICS
DB_USER=sgics_user
DB_PASSWORD=sgics_pass
DB_HOST=mysql.tu-dominio.com
DB_PORT=3306
```

En el compose de dev ya se inyectan valores para el contenedor `backend`. Para MySQL remoto, guarda estos en `backend/.env` y ajusta tus settings a leerlos.

## Seguridad

- Evita `%` en producción; limita por IP o rangos
- Usa contraseñas robustas
- Prefiere túneles (VPN/SSH) en lugar de exponer 3306
- En Docker, si no necesitas acceso externo, quita `"3306:3306"` y usa red interna entre contenedores
