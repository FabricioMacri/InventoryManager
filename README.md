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
    actualizaciones globales y puntuales.
También tiene usuarios admin que sirven para gestionar a los usuarios.
En este proyecto se busca mostrar el desarrollo backend con NodeJS, se utilizan diversas tecnologías
    para que sea una API robusta y escalable, desde sus diferentes despliegues, la autenticación,
    y los controladores hasta el uso del ORM y la base de datos para almacenar y procesar la informacíon
Por último también cuenta con un manipulador de errores que me permite encontrar y entender mas
    facilmente los errores para poder dar un seguimiento y mantenimiento mas sencillo y efectivo.

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