// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/consultar-task', async (req, res) => {
  const { projetoId, taskId } = req.body;

  const AUTH_API_URL = 'https://api.projectcor.com/v1/oauth/token?grant_type=client_credentials';
  const DATA_API_URL = `https://api.projectcor.com/v1/tasks/${taskId}`;

  try {
    const authRes = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic SEU_TOKEN_BASIC_AQUI'
      },
      body: '{}' // ou null se for necessário
    });

    const authData = await authRes.json();
    const token = authData.access_token;

    const dataRes = await fetch(DATA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ projetoId, taskId })
    });

    const taskData = await dataRes.json();
    res.json(taskData);
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor proxy', details: err.message });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
