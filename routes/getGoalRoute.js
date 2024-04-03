const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Goal = require('../models/Goal');

router.get('/goal', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const goal = await Goal.findOne({ user: userId }).sort({ createdAt: -1 }); // Ordena por data de criação em ordem decrescente

    if (!goal) {
      return res.status(404).json({ msg: 'Meta de gastos não encontrada.' });
    }

    res.status(200).json({ goal });
  } catch (error) {
    console.error('Erro ao buscar a meta de gastos:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;
