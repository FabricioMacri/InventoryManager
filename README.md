# API de Gestión de Inventario con MongoDB
Esta es una API que gestiona inventarios pensada para distintos modelos de negocio donde se pueden tener varios inventarios, consultas avanzadas y un CRUD muy simple y dinámico.

**Características**:
- CRUD para productos
- Autenticación y autorización de usuarios
- Consultas avanzadas
- Tests con Mocha y Chai
- Documentación con Swagger

**Funcionamiento**:  
Esta API busca que sus usuarios puedan almacenar su inventario de una manera sectorizada y ordenada para poder hacer consultas avanzadas, cargar ítems con facilidad y rapidez, controlar los ítems, y realizar actualizaciones globales y puntuales.
También tiene usuarios admin que sirven para gestionar a los usuarios.
En este proyecto se busca mostrar el desarrollo backend con NodeJS, se utilizan diversas tecnologías para que sea una API robusta y escalable, desde sus diferentes despliegues, la autenticación y los controladores hasta el uso del ORM y la base de datos para almacenar y procesar la información.
Por último, también cuenta con un manipulador de errores que permite encontrar y entender más fácilmente los errores para poder dar un seguimiento y mantenimiento más sencillo y efectivo.

# Usuario Admin:

- Email: admin@miempresa.com  
- Password: Superadmin1234+  
- Token: aB8@#jK2Lm9&$pQr5StZx^W1  

# Usuarios de prueba:  

    name: "Metalúrgica Progress S.A",  
    email: "gestion@progress.com",  
    password: "metalurgicaprogress123"  
    --
    name: "Ferretería González",  
    email: "ferreteriagonzalez@gmail.com",  
    password: "ferreteriagonzalez123"  

# Tecnologías:

**Lenguaje**:  

    JavaScript - NodeJS

**Framework**:

    Express

**DB & ORM**:

    MongoDB - Mongoose

**Herramientas de Desarrollo**:  

    npm - nodemon - ESLint - Commander - Dotenv

**Autenticación**:  

    Passport - JSON Web Token (jsonwebtoken)

**Documentación**:

    Swagger-jsdoc - Swagger-UI

**Testing**:

    Mocha - Chai

**Utilidades**:  

    Cors - Bcrypt - Standard - Handlebars

# Despliegues:  

- **Dev**: Despliegue en modo desarrollo
- **Prod**: Despliegue para producción
- **Start**: Despliegue normal
- **Test**: Despliegue en modo de testeo  

**NOTA**:  
La diferencia entre dev y prod es qué archivo de variables de entorno está levantando. También existe el script build para su despliegue en producción.
