const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Proxy endpoint for JDoodle credit check
app.post('/api/jdoodle/credits', async (req, res) => {
  try {
    const response = await axios.post('https://api.jdoodle.com/v1/credit-spent', {
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for JDoodle code execution
app.post('/api/jdoodle/execute', async (req, res) => {
  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
      script: req.body.script,
      language: req.body.language,
      versionIndex: req.body.versionIndex
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
