import React, { useEffect } from 'react';
import { Container, Title, Space, Box, Button, Group } from '@mantine/core';
import { createScene } from './scenePage'; // Импортируем функцию createScene
import Store from '../store/store';

const ConstructorPage = () => {
	useEffect(() => {
		const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
		if (canvas) {
			const scene = createScene(canvas);

			if (scene) {
				const handleResize = () => {
					scene.getEngine().resize(); // Изменяем размер движка при изменении окна
				};

				window.addEventListener('resize', handleResize);

				return () => {
					window.removeEventListener('resize', handleResize);
				};
			}
		}
	}, []); // Пустой массив зависимостей, чтобы запускать эффект один раз при монтировании

	// Функция для активации полноэкранного режима
	const handleFullscreen = () => {
		const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		}
	};
  //FIXME: Добавить проверку на авторизацию

	return (
		<Container>
			<Title order={2}>Конструктор</Title>
			<Space h='md' />
			<Group>
				{/* FIXME: исправь положение кнпоки (вид кнопки) */}
				<Button onClick={handleFullscreen}>Полноэкранный режим</Button>
			</Group>
			<Space h='md' />
			<Box style={{ width: '50vw', height: '50vh' }}>
				<canvas
					id='renderCanvas'
					style={{ display: 'block', width: '100%', height: '100%' }}
				/>
			</Box>
		</Container>
	);
};

export default ConstructorPage;
