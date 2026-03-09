// Importamos el framework Express
const express = require("express");

// Creamos la aplicación de Express
const app = express();

// Puerto donde correrá el servidor
const PORT = 3000;

// Middleware incorporado de Express para poder leer JSON en las peticiones
app.use(express.json());

// "Base de datos" temporal en memoria
let usuarios = [];

// Variable para generar IDs incrementales
let id = 1;

/*
Middleware de autorización global

Este middleware revisa que todas las peticiones tengan
el header Authorization con el valor correcto.

Si no coincide, devuelve error 401 (No autorizado)
*/
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (auth !== "fha5HpDXSXSjKU0QCbdXiz1a") {
    return res.status(401).json({ mensaje: "No autorizado" });
  }

  // Si pasa la validación, continúa al siguiente middleware o ruta
  next();
}

/*
Middleware para validar el token personalizado

Este middleware solo se aplica a métodos que NO sean GET.
Es decir:
POST
PUT
DELETE

Revisa que exista el header "token" con el valor correcto.
Si no coincide, devuelve error 403.
*/
function tokenMiddleware(req, res, next) {
  // Solo validar si el método NO es GET
  if (req.method !== "GET") {
    const token = req.headers.token;

    if (token !== "HIZe4D32twWOUP9h0I1IVTlr") {
      return res.status(403).json({ mensaje: "Token inválido" });
    }
  }

  // Si pasa la validación, continúa
  next();
}

// Activamos los middlewares en toda la API
app.use(authMiddleware);
app.use(tokenMiddleware);

/*
POST /usuarios
Crea un nuevo usuario

Body esperado:
{
  "nombre": "Juan",
  "email": "juan@email.com"
}
*/
app.post("/usuarios", (req, res) => {
  const { nombre, email } = req.body;

  // Creamos el objeto usuario
  const usuario = {
    id: id++, // ID autoincremental
    nombre,
    email,
  };

  // Guardamos el usuario en el arreglo
  usuarios.push(usuario);

  // Respondemos con el usuario creado
  res.json(usuario);
});

/*
GET /usuarios
Obtiene la lista de todos los usuarios
*/
app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

/*
PUT /usuarios/:id
Actualiza un usuario existente

Se obtiene el ID desde la URL
*/
app.put("/usuarios/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { nombre, email } = req.body;

  // Buscar usuario por ID
  const usuario = usuarios.find((u) => u.id === userId);

  // Si no existe, devolver error
  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  // Actualizar datos
  usuario.nombre = nombre;
  usuario.email = email;

  res.json(usuario);
});

/*
DELETE /usuarios/:id
Elimina un usuario por ID
*/
app.delete("/usuarios/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  // Filtrar el arreglo para remover el usuario
  usuarios = usuarios.filter((u) => u.id !== userId);

  res.json({ mensaje: "Usuario eliminado" });
});

/*
Inicia el servidor en el puerto definido
*/
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
