const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reminder = require('../models/Reminder');

router.get('/reminder', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const reminder = await Reminder.find({ user: userId });

    if (!reminder) {
      return res.status(404).json({ msg: 'Nenhum lembrete encontrado.' });
    }

    res.status(200).json({ reminder });
  } catch (error) {
    console.error('Erro ao buscar lembretes:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;