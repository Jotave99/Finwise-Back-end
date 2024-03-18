const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');

router.get('/expense', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const expenses = await Expense.find({ user: userId });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Erro ao obter despesas:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;
