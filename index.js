const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

let usuarios = [];

let id = 1;

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (auth !== "fha5HpDXSXSjKU0QCbdXiz1a") {
    return res.status(401).json({ mensaje: "No autorizado" });
  }

  next();
}

/*
Middleware para validar el token personalizado
*/
function tokenMiddleware(req, res, next) {
  if (req.method !== "GET") {
    const token = req.headers.token;

    if (token !== "HIZe4D32twWOUP9h0I1IVTlr") {
      return res.status(403).json({ mensaje: "Token inválido" });
    }
  }

  next();
}

app.use(authMiddleware);
app.use(tokenMiddleware);

/*
POST /usuarios
Crea un nuevo usuario

{
  "nombre": "Juan",
  "email": "juan@email.com"
}
*/
app.post("/usuarios", (req, res) => {
  const { nombre, email } = req.body;

  const usuario = {
    id: id++,
    nombre,
    email,
  };

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

  const usuario = usuarios.find((u) => u.id === userId);

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

  usuarios = usuarios.filter((u) => u.id !== userId);

  res.json({ mensaje: "Usuario eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
