const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Подключаем Mongoose
const connectDB = require('./config/db'); // Подключаем конфигурацию

const app = express();
const port = process.env.PORT || 3001;
require('./routes')(app);

// Middleware для работы с JSON
app.use(express.json());
app.use(cors());

// Подключение к базе данных MongoDB
connectDB();

// Запуск сервера
app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});
