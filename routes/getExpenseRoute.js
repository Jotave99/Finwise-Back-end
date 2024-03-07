const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');

router.get('/expense', async (req, res) => {
  try {
    // Verifica se o token de autorização foi fornecido no cabeçalho da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido.' });
    }

    // Decodifica o token para obter o ID do usuário
    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    // Encontra todas as despesas associadas ao usuário pelo ID do usuário
    const expenses = await Expense.find({ user: userId });

    // Retorna as despesas encontradas
    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Erro ao obter despesas:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;
