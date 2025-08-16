const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- Almacenamiento temporal en memoria ---
const gastosPorUsuario = {};

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

// Si no tienes un app.listen, agrégalo al final:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});