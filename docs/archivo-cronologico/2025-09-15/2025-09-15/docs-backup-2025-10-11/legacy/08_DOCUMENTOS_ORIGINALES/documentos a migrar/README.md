
#LINK para ver Formulario PREINSCRIPCION: https://forms.gle/KwnRcNmtiFcFrHK46

#archivo CURSO MEDIO 2025_06 es el excel donde esta la información.. RECORDAR LA CONFIDENCIALIDAD.

# Proyecto Cursos Scouts

Este proyecto es una aplicación web desarrollada con Django para el backend y un frontend separado (probablemente en un framework JavaScript como React, Angular o Vue.js).

## Discord Del Proyecto
https://discord.gg/79wttQ7j

## Estructura del Proyecto

El proyecto se divide en dos directorios principales:

- `backend_scout/`: Contiene la aplicación Django que actúa como el backend de la aplicación.
- `frontend_scout/`: Contiene los archivos del frontend de la aplicación.

## Acerca de Django

Django es un framework de desarrollo web de alto nivel y código abierto, escrito en Python, que fomenta el desarrollo rápido y el diseño limpio y pragmático. Fue creado para facilitar la construcción de aplicaciones web complejas y basadas en bases de datos, siguiendo el principio "Don't Repeat Yourself" (DRY).

**¿Por qué se usa Django en este proyecto?**

1.  **Desarrollo Rápido:** Django incluye muchas características "out of the box" como un ORM (Object-Relational Mapper), un sistema de administración de usuarios, un panel de administración automático y un sistema de plantillas, lo que acelera significativamente el proceso de desarrollo.
2.  **Seguridad:** Django tiene una fuerte reputación en seguridad, ofreciendo protecciones integradas contra muchas vulnerabilidades comunes como CSRF, XSS, inyección SQL y clickjacking.
3.  **Escalabilidad:** Es utilizado por sitios web de alto tráfico, lo que demuestra su capacidad para escalar y manejar grandes volúmenes de usuarios y datos.
4.  **Comunidad y Ecosistema:** Cuenta con una comunidad grande y activa, así como una vasta colección de paquetes y librerías de terceros que extienden su funcionalidad.
5.  **Python:** Al estar escrito en Python, permite aprovechar la simplicidad y legibilidad del lenguaje, lo que facilita el mantenimiento y la colaboración en el código.

En este proyecto, Django se utiliza para construir el backend robusto y seguro que gestionará la lógica de negocio, la base de datos y la exposición de APIs REST para el frontend.

## Backend (Django)

El directorio `backend_scout/` contiene la configuración básica de un proyecto Django:

- `manage.py`: Una utilidad de línea de comandos que te permite interactuar con tu proyecto Django de varias maneras (ejecutar el servidor de desarrollo, ejecutar migraciones, etc.).
- `backend_scout/`: Este es el paquete principal de tu proyecto Django. Contiene los siguientes archivos:
    - `__init__.py`: Un archivo vacío que indica que este directorio es un paquete Python.
    - `settings.py`: Contiene la configuración de tu proyecto Django, como la base de datos, las aplicaciones instaladas, los middlewares, etc.
    - `urls.py`: Define las rutas URL de tu proyecto, mapeando URLs a vistas.
    - `wsgi.py`: Un punto de entrada para servidores web compatibles con WSGI para servir tu proyecto.
    - `asgi.py`: Un punto de entrada para servidores web compatibles con ASGI para servir tu proyecto (útil para WebSockets y aplicaciones asíncronas).

## Frontend

El directorio `frontend_scout/` está vacío en este momento, el desarrollo frontend, queda pendiente.

## Cómo Empezar (Backend)

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/nilsonGuerraInacap/proyecto_cursos_scouts.git
    cd proyecto_cursos_scouts/backend_scout
    ```

2.  **Crear un entorno virtual (recomendado):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Linux/macOS
    venv\Scripts\activate     # En Windows
    ```

3.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Realizar migraciones de la base de datos:**
    ```bash
    python manage.py migrate
    ```

5.  **Crear un superusuario(creado)**
    ```bash
    python manage.py createsuperuser
    ```

6.  **Ejecutar el servidor de desarrollo:**
    ```bash
    python manage.py runserver
    ```
    El backend estará disponible en `http://127.0.0.1:8000/`.

### Frontend

Actualmente, el frontend no está implementado. Las instrucciones para su configuración e inicio se añadirán una vez que se defina y desarrolle.

## Dependencias del Proyecto

Este proyecto utiliza las siguientes librerías clave de Python para extender su funcionalidad:

*   **Django REST Framework (DRF)**: Un potente y flexible kit de herramientas para construir APIs web. Se utiliza para crear las interfaces de programación de aplicaciones (APIs) que permiten que el frontend (o cualquier otra aplicación cliente) se comunique con el backend de manera estructurada y eficiente.
*   **Django Simple JWT**: Proporciona una forma sencilla de implementar la autenticación basada en JSON Web Tokens (JWT) para las APIs REST. Esto permite un sistema de autenticación seguro y sin estado, donde los usuarios reciben un token después de iniciar sesión, que luego usan para acceder a recursos protegidos.
*   **Django Allauth**: Un conjunto integrado de aplicaciones de Django que maneja la autenticación, el registro de usuarios, la gestión de cuentas y la autenticación de terceros (social). Simplifica enormemente la implementación de flujos de autenticación complejos.

Para asegurar que todas las dependencias estén instaladas, puedes generar o actualizar el archivo `requirements.txt` con el siguiente comando (asegúrate de estar en tu entorno virtual):
```bash
pip freeze > backend_scout/requirements.txt
```

## Próximos Pasos

-   Desarrollar las aplicaciones de Django dentro de `backend_scout/` para manejar la lógica de negocio y los modelos de datos.
- Decidir Si usaremos React u otro framework frontend.
