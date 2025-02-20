const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config/config');
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
