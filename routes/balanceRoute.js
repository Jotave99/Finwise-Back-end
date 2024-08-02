const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const moment = require('moment-timezone');

router.post('/balance', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        const { name, category, value, date } = req.body;

        if (!['Salário', 'Outros'].includes(category)) {
            return res.status(400).json({ msg: 'Categoria inválida' });
        }

        if (!name || !value || !date) {
            return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
        }

        const localDate = moment.tz(date, 'YYYY-MM-DD', 'America/Sao_Paulo').toDate();

        const receipt = {
            name,
            category,
            date: localDate,
            value: parseFloat(value)
        };

        user.balance += parseFloat(value);
        user.receipts.push(receipt);

        await user.save();

        res.status(200).json({ msg: 'Recebimento adicionado com sucesso', newBalance: user.balance });
    } catch (error) {
        console.error('Erro ao adicionar saldo:', error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

router.get('/balance', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        res.status(200).json({ balance: user.balance, receipts: user.receipts });
    } catch (error) {
        console.error('Erro ao obter saldo:', error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

module.exports = router;
