import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

// Proxy endpoint for JDoodle credit check
app.post('/credits', async (req, res) => {
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
app.post('/execute', async (req, res) => {
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

export default app;
