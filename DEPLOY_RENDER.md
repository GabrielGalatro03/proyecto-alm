Deploy en Render (web + PostgreSQL)

1. Subir este proyecto a un repositorio de GitHub.
2. Entrar a Render y elegir New + Blueprint.
3. Seleccionar el repositorio que contiene este proyecto.
4. Render detectara el archivo render.yaml y creara:
   - un servicio web
   - una base de datos PostgreSQL
5. Esperar el primer deploy.
6. Abrir la URL publica del servicio.

Credenciales de acceso de la app
- Usuario: almacenmirta
- Contrasena: almacen!

Importante para produccion
- Cambiar ADMIN_PASSWORD por una clave fuerte en Render.
- Mantener SESSION_SECRET autogenerado por Render.
- Verificar que NODE_ENV quede en production.

Archivos usados para deploy
- Dockerfile
- .dockerignore
- render.yaml
