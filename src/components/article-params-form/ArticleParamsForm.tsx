import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';

import clsx from 'clsx';

import { useState, useEffect, FormEvent, useRef } from 'react';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';
import { Text } from 'components/text';
import { Select } from 'components/select';
import { RadioGroup } from 'components/radio-group';
import { Separator } from '../separator';

import styles from './ArticleParamsForm.module.scss';

interface ArticleParamsFormProps {
	// состояние статьи
	articleState: ArticleStateType;
	// функция для установки нового состояния статьи
	setArticleState(props: ArticleStateType): void;
}

//Компонент формы параметров статьи
export const ArticleParamsForm = ({
	articleState,
	setArticleState,
}: ArticleParamsFormProps) => {
	// Локальное состояние формы и параметров статьи
	const [isOpen, setIsOpen] = useState(false);
	const [state, setState] = useState(articleState);

	// для открытия формы
	function handleOpenForm() {
		setIsOpen((prevForm) => !prevForm);
	}

	// Ссылка на элемент формы для отслеживания кликов вне формы
	const ref = useRef<HTMLFormElement | null>(null);

	// Обработчик закрытия формы, если нажимаем Escape, если кликаем вне формы
	useEffect(() => {
		if (!isOpen) return;

		function closeForm(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		}

		function closeClickForm(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		// Добавление обработчиков событий
		document.addEventListener('keydown', closeForm);
		document.addEventListener('mousedown', closeClickForm);

		// Удаление обработчиков событий при размонтировании
		return () => {
			document.removeEventListener('keydown', closeForm);
			document.removeEventListener('mousedown', closeClickForm);
		};
	}, [isOpen]);

	// Обработчик сохранения изменений и закрытия формы
	function handleFormSubmit(event: FormEvent) {
		event.preventDefault();
		setArticleState(state);
	}

	// Обработчик сброса параметров
	function handleFormReset() {
		setState(defaultArticleState);
		setArticleState(defaultArticleState);
	}

	return (
		<>
			{/* Кнопка для открытия/закрытия формы */}
			<ArrowButton form={isOpen} onClick={handleOpenForm} />

			{/* Сайдбар с формой параметров статьи */}

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleFormSubmit}
					onReset={handleFormReset}
					ref={ref}>
					<Text
						as='h1'
						size={31}
						weight={800}
						fontStyle='normal'
						uppercase={true}
						align='left'
						family='open-sans'>
						Задайте параметры
					</Text>

					{/*выбор шрифта */}
					<Select
						selected={state.fontFamilyOption}
						options={fontFamilyOptions}
						title='Шрифт'
						onChange={(selected) =>
							setState({ ...state, fontFamilyOption: selected })
						}
					/>

					{/* выбор размер шрифта */}
					<RadioGroup
						name='font-size'
						options={fontSizeOptions}
						selected={state.fontSizeOption}
						onChange={(selected) =>
							setState({ ...state, fontSizeOption: selected })
						}
						title='Размер шрифта'
					/>

					{/* выбор цвета шрифта */}
					<Select
						selected={state.fontColor}
						options={fontColors}
						title='Цвет шрифта'
						onChange={(selected) => setState({ ...state, fontColor: selected })}
					/>

					<Separator />

					{/* выбор цвета фона */}
					<Select
						selected={state.backgroundColor}
						options={backgroundColors}
						title='Цвет фона'
						onChange={(selected) =>
							setState({ ...state, backgroundColor: selected })
						}
					/>

					{/* выбор ширины контента */}
					<Select
						selected={state.contentWidth}
						options={contentWidthArr}
						title='Ширина контента'
						onChange={(selected) =>
							setState({ ...state, contentWidth: selected })
						}
					/>
					{/* Кнопки для сброса и применения параметров */}

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
