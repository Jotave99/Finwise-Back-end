const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Goal = require('../models/Goal');

router.post('/goal', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const { amount } = req.body;

    const goal = new Goal({
      user: userId,
      amount
    });

    await goal.save();

    res.status(200).json({ msg: 'Meta de gastos adicionada com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar a meta de gastos:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;
