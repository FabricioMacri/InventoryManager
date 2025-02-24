# API de Gestión de Inventario con MongoDB
Esta es una API que gestiona inventarios pensado para distintos modelos de negocio donde se pueden hacer tener varios inventarios, consultas avanzadas y un CRUD muy simple y dinamico

**Características**:
- CRUD para productos
- Autenticación y autorización de usuarios
- Consultas avanzadas
- Test con Mocha y Chai
- Documentación con Swagger

**Funcionamiento**:  
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

- Email: admin@miempresa.com  
- password: Superadmin1234+  
- Token: aB8@#jK2Lm9&$pQr5StZx^W1  

# Usuarios de prueba:  


    name: "Metalurgica Progress S.A",  
    email: "gestion@progress.com",  
    password: "metalurgicaprogress123"  
    --
    name: "Ferretería Gonzales",  
    email: "ferreteriagonzalez@gmail.com",  
    password: "ferreteriagonzalez123"  


# Tecnologias:

**Lenguaje**:  

    JavaScript - NodeJS

**Framework**:

    Express

**DB & ORM**:

    MongoDB - Mongoose

**Development Tools**:  

    NPM - Nodemon - ESLint - Commander - Dotenv

**AUTH**:  

    passport - jsonwebtoken

**DOCS**:

    Swagger

**Testing**:

    Mocha - Chai

**Utils**:  

    Cors - Bcrypt - Standard

# Deployments:  

- **Dev**: Despligue en modo desarrollo

- **Prod**: Despliegue para produccion

- **Start**: Despliegue normal

- **Test**: Despliegue en modo de testeo  


**NOTA**:  
    La diferencia entre dev y prod es que archivo de variables de entorno esta levantando. Tambien existe el script build para su despliegue en produccion.

