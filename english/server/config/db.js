// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(
			'mongodb://root:P48cD4iKfZ26exd4Lp2H@195.54.178.243:24625/english?authSource=admin'
		);
		console.log('Подключено к MongoDB');
	} catch (error) {
		console.error('Ошибка подключения к MongoDB', error);
		process.exit(1); // Завершение процесса, если подключение не удалось
	}
};

module.exports = connectDB;
