import dbConnect from '../../../backend/config/db';
import Word from '../../../backend/models/words';

export async function GET(req) {
	await dbConnect(); // Подключаемся к базе данных

	const { schoolClass, lessonUnit, unitStep } = req.nextUrl.searchParams;

	try {
		const filter = {};
		if (schoolClass) filter.schoolClass = Number(schoolClass);
		if (lessonUnit) filter.lessonUnit = Number(lessonUnit);
		if (unitStep) filter.unitStep = Number(unitStep);

		const words = await Word.find(filter);

		if (words.length === 0) {
			return new Response(JSON.stringify({ message: 'Уроки не найдены' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify(words), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ message: 'Ошибка получения уроков', error }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
