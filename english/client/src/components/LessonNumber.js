import React, { useState, useEffect } from 'react';
import { fetchWords, fetchAvailableOptions } from '../api/api';
import LessonList from './LessonList';
import LessonSelect from './LessonSelect';

function Lesson() {
	const [data, setData] = useState([]);
	const [availableLessons, setAvailableLessons] = useState([]);
	const [availableSteps, setAvailableSteps] = useState([]);
	const [schoolClass, setSchoolClass] = useState(() => {
		return JSON.parse(localStorage.getItem('schoolClass')) || 2;
	});
	const [lessonUnit, setLessonUnit] = useState(() => {
		return JSON.parse(localStorage.getItem('lessonUnit')) || 1;
	});
	const [unitStep, setUnitStep] = useState(() => {
		return JSON.parse(localStorage.getItem('unitStep')) || 1;
	});

	// Загружаем доступные уроки и шаги при изменении класса или урока
	useEffect(() => {
		const loadAvailableOptions = async () => {
			try {
				const options = await fetchAvailableOptions(schoolClass);
				if (options) {
					setAvailableLessons(options.lessons || []);
					const stepsForCurrentLesson = await fetchStepsForLesson(
						lessonUnit,
						schoolClass
					);
					setAvailableSteps(stepsForCurrentLesson || []);
				}
			} catch (error) {
				console.error('Ошибка при загрузке доступных опций:', error);
			}
		};

		loadAvailableOptions();
	}, [schoolClass, lessonUnit]); // Загрузка доступных опций при изменении класса или урока

	// Загружаем уроки при изменении фильтров
	useEffect(() => {
		const loadLessons = async () => {
			const filters = { schoolClass, lessonUnit, unitStep };
			try {
				const lessons = await fetchWords(filters);
				setData(lessons);
			} catch (error) {
				console.error('Ошибка при загрузке уроков:', error);
			}
		};

		loadLessons();
	}, [schoolClass, lessonUnit, unitStep]); // Загрузка данных при изменении фильтров

	const fetchStepsForLesson = async (lessonUnit, schoolClass) => {
		const response = await fetch(
			`/steps?lessonUnit=${lessonUnit}&schoolClass=${schoolClass}`
		);
		const steps = await response.json();
		return steps; // Верните доступные шаги для выбранного урока
	};

	// Сохраняем выбранные опции в localStorage
	useEffect(() => {
		localStorage.setItem('schoolClass', JSON.stringify(schoolClass));
		localStorage.setItem('lessonUnit', JSON.stringify(lessonUnit));
		localStorage.setItem('unitStep', JSON.stringify(unitStep));
	}, [schoolClass, lessonUnit, unitStep]); // Сохранение в localStorage при изменении опций

	// Очищаем localStorage при изменении schoolClass
	const handleSchoolClassChange = newClass => {
		setSchoolClass(newClass);
		localStorage.clear(); // Очищаем localStorage
	};

	return (
		<div className='Lesson'>
			<LessonSelect
				schoolClass={schoolClass}
				setSchoolClass={handleSchoolClassChange} // Используем обработчик изменения
				lessonUnit={lessonUnit}
				setLessonUnit={setLessonUnit}
				unitStep={unitStep}
				setUnitStep={setUnitStep}
				availableLessons={availableLessons} // Передаем доступные уроки
				availableSteps={availableSteps} // Передаем доступные шаги
			/>
			<LessonList data={data} />
		</div>
	);
}

export default Lesson;
