const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');

router.post('/resetMonthlyData', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    await Expense.deleteMany({ user: userId });

    await Goal.findOneAndUpdate({ user: userId }, { amount: 0 });

    res.status(200).json({ msg: 'Dados mensais resetados com sucesso.' });
  } catch (error) {
    console.error('Erro ao resetar dados mensais:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

router.get('/goalDifference', async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ msg: 'Token não fornecido.' });
      }
  
      const decoded = jwt.verify(token, process.env.SECRET);
      const userId = decoded.id;
  
      const expenses = await Expense.find({ user: userId });
  
      let totalExpenses = 0;
      expenses.forEach(expense => {
        totalExpenses += expense.value;
      });
  
      const goal = await Goal.findOne({ user: userId }).sort({ createdAt: -1 });
  
      if (!goal) {
        return res.status(404).json({ msg: 'Meta de gastos não encontrada.' });
      }
  
      const goalDifference = goal.amount - totalExpenses;
  
      res.status(200).json({ goalDifference });
    } catch (error) {
      console.error('Erro ao calcular a diferença da meta de gastos:', error);
      res.status(500).json({ msg: 'Erro no servidor.' });
    }
  });
 
module.exports = router;