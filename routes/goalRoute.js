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

    if (typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({ msg: 'Formato inválido para a meta de gastos.' });
    }

    const month = new Date().toISOString().slice(0, 7);

    const goal = new Goal({
      user: userId,
      amount: amount,
      month: month,
    });

    await goal.save();

    res.status(200).json({ msg: 'Meta de gastos adicionada com sucesso.', goal });
  } catch (error) {
    console.error('Erro ao adicionar a meta de gastos:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

router.get('/goal', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const month = new Date().toISOString().slice(0, 7);

    const goal = await Goal.findOne({ user: userId, month }).sort({ createdAt: -1 });

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
