import * as BABYLON from '@babylonjs/core';
import * as dat from 'dat.gui';

export const createGUI = (
	canvas: HTMLCanvasElement,
	// ground: BABYLON.Mesh,
	// scene: BABYLON.Scene,
	shapes: BABYLON.Mesh[]
) => {
	const gui = new dat.GUI({ autoPlace: false });
	const guiContainer = document.createElement('div');
	guiContainer.style.position = 'absolute';
	guiContainer.style.top = '10px';
	guiContainer.style.right = '10px';
	canvas.parentElement?.appendChild(guiContainer);
	gui.domElement.style.zIndex = '1';
	guiContainer.appendChild(gui.domElement);

	const options = {
		shape: 'box',
		size: 1,
		color: '#ffffff',
		rotateX: () => {},
		rotateY: () => {},
		collisions: true,
		physicsEnabled: true, // Добавляем опцию для управления физикой
	};

	gui
		.add(options, 'shape', ['box', 'sphere', 'cylinder', 'cone'])
		.onChange(value => {
			options.shape = value;
		});
	gui.add(options, 'size', 0.1, 5);
	gui.addColor(options, 'color');

	const clearAllShapes = () => {
		shapes.forEach(shape => {
			shape.dispose(); // Удаляем фигуру из сцены
		});
		shapes.length = 0; // Очищаем массив фигур
	};

	const undoLastShape = () => {
		if (shapes.length > 0) {
			const lastShape = shapes.pop(); // Убираем последнюю фигуру из массива
			lastShape?.dispose(); // Удаляем фигуру из сцены
		}
	};

	gui.add({ clearAllShapes }, 'clearAllShapes').name('Очистить все');
	gui.add({ undoLastShape }, 'undoLastShape').name('Отменить последнюю');

	gui
		.add(options, 'physicsEnabled')
		.name('Включить физику')
		.onChange(value => {
			shapes.forEach(shape => {
				if (shape.physicsImpostor) {
					if (value) {
						shape.physicsImpostor.wakeUp();
					} else {
						shape.physicsImpostor.sleep();
					}
				}
			});
		});

	// Обработчик клавиатуры для отмены последнего действия
	const handleKeyDown = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
			event.preventDefault(); // Предотвращаем стандартное поведение
			undoLastShape(); // Вызываем функцию отмены
		}
	};
	document.addEventListener('keydown', handleKeyDown);

	return { options, gui };
};
