const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Reminder = require('../models/Reminder');

router.post('/reminder', async (req, res) => {
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

    const { name, date, value } = req.body;

    const reminder = new Reminder({
      user: userId,
      name,
      date,
      value
    });

    await reminder.save();

    res.status(200).json({ msg: 'Lembrete adicionado com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar o lembrete:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

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