const Word = require('../models/words'); // Подключите вашу модель данных

module.exports = function (app) {
	app.get('/words', async (req, res) => {
		const { schoolClass, lessonUnit, unitStep } = req.query; // Получаем параметры из запроса

		try {
			// Создаем объект для фильтрации
			const filter = {};
			if (schoolClass) filter.schoolClass = Number(schoolClass); // Преобразуем в число
			if (lessonUnit) filter.lessonUnit = Number(lessonUnit); // Преобразуем в число
			if (unitStep) filter.unitStep = Number(unitStep); // Преобразуем в число

			// Найти слова по фильтру
			const words = await Word.find(filter);

			if (words.length === 0) {
				return res.status(404).json({ message: 'Уроки не найдены' });
			}

			res.json(words);
		} catch (error) {
			res.status(500).json({ message: 'Ошибка получения уроков', error });
		}
	});
	app.get('/options', async (req, res) => {
		const { schoolClass } = req.query;

		try {
			const options = await Word.distinct('lessonUnit', { schoolClass });
			const steps = await Word.distinct('unitStep', { schoolClass });

			res.json({ lessons: options, steps });
		} catch (error) {
			res.status(500).json({ message: 'Ошибка при получении опций', error });
		}
	});
	app.get('/steps', async (req, res) => {
		const { lessonUnit, schoolClass } = req.query;

		try {
			const steps = await Word.distinct('unitStep', {
				lessonUnit: Number(lessonUnit),
				schoolClass: Number(schoolClass),
			});

			res.json(steps);
		} catch (error) {
			res.status(500).json({ message: 'Ошибка при получении шагов', error });
		}
	});
};
