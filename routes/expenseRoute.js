const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const User = require('../models/User');
const Expense = require('../models/Expense');

router.post('/expense', async (req, res) => {
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

    const { name, type, value, date } = req.body;

    const localDate = moment.tz(date, 'YYYY-MM-DD', 'America/Sao_Paulo').toDate();

    const expense = new Expense({
      user: userId,
      name,
      type,
      date: localDate,
      value
    });

    await expense.save();

    user.balance -= value;
    await user.save();

    res.status(200).json({ msg: 'Despesa adicionada com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

router.get('/expense/currentMonth', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const expenses = await Expense.find({
      user: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Erro ao obter despesas do mês atual:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

router.get('/expense/:year/:month', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const { year, month } = req.params;
    const startOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').toDate();
    const endOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').toDate();

    const expenses = await Expense.find({
      user: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Erro ao obter despesas de um mês específico:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;