const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

        const { balance } = req.body;
        user.balance = parseFloat(user.balance) + parseFloat(balance);

        await user.save();

        res.status(200).json({ msg: 'Saldo adicionado com sucesso', newBalance: user.balance });
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

        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.error('Erro ao obter saldo:', error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

module.exports = router;
