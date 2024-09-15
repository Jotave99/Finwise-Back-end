const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const moment = require('moment');

router.get('/goalDifference', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const currentMonth = moment().format('YYYY-MM');

    const goal = await Goal.findOne({ user: userId, month: currentMonth });

    if (!goal) {
      return res.status(404).json({ msg: 'Meta de gastos não encontrada para o mês atual.' });
    }

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.value, 0);

    const goalDifference = goal.amount - totalExpenses;

    res.status(200).json({ goalDifference });
  } catch (error) {
    console.error('Erro ao calcular a diferença entre meta e despesas:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;
