const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Expense = require('../models/Expense');

router.get('/expense/total', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const expenses = await Expense.find({ user: userId });

    let totalExpenses = 0;
    expenses.forEach(expense => {
      totalExpenses += expense.value;
    });

    res.status(200).json({ totalExpenses });
  } catch (error) {
    console.error('Erro ao calcular despesas totais:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;