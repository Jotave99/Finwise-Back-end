require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const balanceRoute = require('./routes/balanceRoute');
const expenseRoute = require('./routes/expenseRoute');
const totalExpenseRoute = require('./routes/totalExpenseRoute');
const goalRoute = require('./routes/goalRoute');
const reminderRoute = require('./routes/reminderRoute');
const resetRoute = require('./routes/resetRoute');
const goalDifference = require('./routes/goalDifference');

const app = express();

app.use(express.json());
app.use(cors());

const User = require('./models/User');

app.get('/', (req, res) =>{
    res.status(200).json({ msg: 'Back-end do Finwise!'});
})

app.get('/user/:id', checkToken, async(req,res) => {
    const id = req.params.id;
    const user = await User.findById(id, '-password');

    if(!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado.'});
    }

    res.status(200).json({user});
});

function checkToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({msg: 'Acesso negado!'});
    }

    try{
        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();
    }catch(error){
        res.status(400).json({msg:'Token inválido.'});
    }
}

app.post('/auth/register', async(req,res) =>{

    console.log('Recebendo solicitação para criar uma nova conta:', req.body);

    const {name, email, password, confirmPassword} = req.body;

    if(!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório!'});
    }
    if(!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!'});
    }
    if(!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!'});
    }
    if(password != confirmPassword){
        return res.status(422).json({ msg: 'As senhas não conferem.'});
    }

    const userExists = await User.findOne({email:email});

    if(userExists){
        return res.status(422).json({ msg: 'Por favor, utilize outro email.'});
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try{
        await user.save();

        console.log('Usuário criado com sucesso:', user);

        res.status(201).json({msg: 'Usuário criado com sucesso!'});

    }catch(error){
        res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde.'})
    };
});

app.post('/auth/login', async(req, res) =>{
    const {email, password} = req.body;

    if(!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!'});
    }
    if(!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!'});
    }

    const user = await User.findOne({email:email});

    if(!user){
        return res.status(404).json({msg:'Este usuário não existe. Por favor, utilize um e-mail válido, ou cadastre-se.'})
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword){
        return res.status(404).json({msg:'Senha inválida.'});
    }

    try{
        const secret = process.env.SECRET;
        const token = jwt.sign({
            id: user._id
        }, secret,
        )

        res.status(200).json({msg: 'Autenticação realizada com sucesso.', token})
    }catch(err){

    }


});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

app.use(balanceRoute);
app.use(expenseRoute);
app.use(totalExpenseRoute);
app.use(goalRoute);
app.use(reminderRoute);
app.use(resetRoute);
app.use(goalDifference);

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.yexraev.mongodb.net/?retryWrites=true&w=majority`,
    ).then(() =>{
    app.listen(3001)
    console.log('Conectou ao banco!')
}).catch((err) => console.log(err));
