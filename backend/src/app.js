const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- Almacenamiento temporal en memoria ---
const gastosPorUsuario = {};

// Almacenamiento temporal de usuarios en memoria
const usuarios = {};

// Obtener gastos de un usuario
app.get('/gastos', (req, res) => {
  const mail = req.query.mail;
  if (!mail) return res.status(400).json({ error: 'Falta el mail' });
  const gastos = gastosPorUsuario[mail] || { gastosFijos: [], gastosVariables: [] };
  res.json(gastos);
});

// Guardar gastos de un usuario
app.post('/gastos', (req, res) => {
  const { mail, gastosFijos, gastosVariables } = req.body;
  if (!mail) return res.status(400).json({ error: 'Falta el mail' });
  gastosPorUsuario[mail] = {
    gastosFijos: gastosFijos || [],
    gastosVariables: gastosVariables || []
  };
  res.json({ ok: true });
});

// Registrar usuario
app.post('/usuarios', (req, res) => {
  const { nombre, apellido, nacimiento, mail, celular } = req.body;
  if (!nombre || !apellido || !nacimiento || !mail || !celular) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  if (usuarios[mail]) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }
  usuarios[mail] = { nombre, apellido, nacimiento, mail, celular };
  res.json(usuarios[mail]);
});

// Obtener usuario por email
app.get('/usuarios/:mail', (req, res) => {
  const mail = req.params.mail;
  if (!usuarios[mail]) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(usuarios[mail]);
});

// Login simple (nombre y mail)
app.post('/login', (req, res) => {
  const { nombre, mail } = req.body;
  const usuario = usuarios[mail];
  if (usuario && usuario.nombre === nombre) {
    res.json(usuario);
  } else {
    res.status(401).json({ error: 'Usuario o email incorrectos' });
  }
});

// Si no tienes un app.listen, agrégalo al final:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});