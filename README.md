# Proyecto 2: API de Gestión de Inventario con MongoDB
**Descripción**: Un API RESTful para gestionar el inventario de una tienda. Permite a los usuarios agregar, actualizar, eliminar y consultar productos.

**Características**:
- CRUD para productos.
- Autenticación y autorización de usuarios.
- Búsqueda de productos por nombre, categoría o precio.
- Integración con un sistema de notificaciones para alertar sobre productos con bajo stock.
- Documentación del API utilizando Swagger o Postman.

**Descripción**:
Esta API busca que sus usuarios puedan almacenar su invantario de una manera sectorizada y ordenada
    para poder hacer consultas avanzadas, carga de items con facilicada y rapidez, control de los items,
    actualizaciones globales y puntuales y un sistema de notificaciones cuando un producto se acaba.
También tiene usuarios admin que tienen acceso solo de lectura a todos los inventarios para poder hacer
    métricas globales y para gestionar los usuarios.
En este proyecto se busca mostrar el desarrollo backend con NodeJS, se utilizan diversas tecnologías
    para que sea una API robusta y escalable, desde sus diferentes despliegues, la autenticación,
    y los controladores hasta el uso del ORM y la base de datos para almacenar y procesar la informacíon

# PROCESO:

**Config**: 
    -config:        ✅
    -passport:      🔍
**Controllers**:
    -Inventory:     🧪
    -users:         🔨
**Models**:
    -inventory:     ✅
    -users:         ✅
    -errors:        ✅
**Public**:
    -css:           ❌
    -js:            ❌
**Routes**:
    -inventory:      🔨
    -session:        🔍
    -user:           🔨
    -views:          ❌
**Utils**:
    -commander:      ✅
    -hashbcrypt:     ✅
    -validator:      ✅
**Views**:
    -layouts:        ✅
    -home:           🔨

# Usuario Admin:

-Email: admin@miempresa.com
-password: Superadmin1234+
-Token: aB8@#jK2Lm9&$pQr5StZx^W1

# Usuarios de prueba:

{
    "name": "Metalurgica Progress S.A",
    "email": "gestion@progress.com",
    "password": "metalurgicaprogress123"
},
{
    "name": "Ferretería Gonzales",
    "email": "ferreteriagonzalez@gmail.com",
    "password": "ferreteriagonzalez123"
}

# NOTAS:
-El registro posee un método de autenticación diferente al de login, esto es únicamente para mostrar
    el uso de estos distintos métodos.