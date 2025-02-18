const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { users, getNextUserId } = require('../data/data');
const { JWT_SECRET } = require('../config/config');

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Необходимо указать username и password' });
    
    const existingUser = users.find(u => u.username === username);
    if (existingUser)
        return res.status(400).json({ error: 'Пользователь уже существует' });

    const newUser = { id: getNextUserId(), username, password };
    users.push(newUser);
    res.json({ message: 'Регистрация успешна' });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: 'Неверные данные' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

router.get('/me', require('../middlewares/authenticate'), (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json({ id: user.id, username: user.username });
});

module.exports = router;
