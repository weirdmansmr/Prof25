const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { files, getNextFileId, users } = require('../data/data');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', authenticate, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Нет файла в запросе' });

    const fileRecord = {
        id: getNextFileId(),
        ownerId: req.user.id,
        filename: req.file.filename,
        originalname: req.file.originalname,
        sharedWith: []
    };
    files.push(fileRecord);
    res.json({ message: 'Файл загружен', file: fileRecord });
});

router.get('/', authenticate, (req, res) => {
    const userFiles = files.filter(f => f.ownerId === req.user.id);
    res.json(userFiles);
});

router.get('/shared', authenticate, (req, res) => {
    const sharedFiles = files.filter(f => f.sharedWith.includes(req.user.id));
    res.json(sharedFiles);
    });

    router.get('/:id', authenticate, (req, res) => {
    const fileId = parseInt(req.params.id);
    const file = files.find(f => f.id === fileId);
    if (!file) return res.status(404).json({ error: 'Файл не найден' });

    if (file.ownerId !== req.user.id && !file.sharedWith.includes(req.user.id)) {
        return res.status(403).json({ error: 'Нет доступа к файлу' });
    }
    res.json(file);
});

router.put('/:id', authenticate, upload.single('file'), (req, res) => {
    const fileId = parseInt(req.params.id);
    const file = files.find(f => f.id === fileId);
    if (!file) return res.status(404).json({ error: 'Файл не найден' });

    if (file.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Редактировать может только владелец файла' });
    }
    
    if (!req.file) return res.status(400).json({ error: 'Нет нового файла для замены' });
    
    const oldFilePath = path.join(__dirname, '..', 'uploads', file.filename);
    fs.unlink(oldFilePath, (err) => {
        if (err) console.error('Ошибка при удалении файла:', err);
    });
    
    file.filename = req.file.filename;
    file.originalname = req.file.originalname;
    
    res.json({ message: 'Файл обновлён', file });
});

router.post('/:id/share', authenticate, (req, res) => {
    const fileId = parseInt(req.params.id);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Не указан userId для предоставления доступа' });

    const file = files.find(f => f.id === fileId);
    if (!file) return res.status(404).json({ error: 'Файл не найден' });

    if (file.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Доступ предоставлять может только владелец файла' });
    }

    const userToShare = users.find(u => u.id === parseInt(userId));
    if (!userToShare) return res.status(404).json({ error: 'Пользователь для доступа не найден' });

    if (!file.sharedWith.includes(parseInt(userId))) {
        file.sharedWith.push(parseInt(userId));
    }
    
    res.json({ message: 'Доступ предоставлен', file });
});

router.delete('/:id/share/:userId', authenticate, (req, res) => {
    const fileId = parseInt(req.params.id);
    const shareUserId = parseInt(req.params.userId);

    const file = files.find(f => f.id === fileId);
    if (!file) return res.status(404).json({ error: 'Файл не найден' });

    if (file.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Доступ убирать может только владелец файла' });
    }
    
    file.sharedWith = file.sharedWith.filter(id => id !== shareUserId);
    res.json({ message: 'Доступ удалён', file });
});

module.exports = router;
