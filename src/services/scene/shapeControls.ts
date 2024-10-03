import * as BABYLON from '@babylonjs/core';
import { createShape } from './shapeFactory';

let selectedMesh: BABYLON.Mesh | null = null;
let isDragging = false;
let isRotating = false;
let rotateAxis: 'x' | 'y' | null = null;

const snapToGrid = (position: BABYLON.Vector3, gridSize: number = 1) => {
	const halfGridSize = gridSize / 2;
	return new BABYLON.Vector3(
		Math.floor(position.x / gridSize) * gridSize + halfGridSize, // Смещение в центр квадрата по X
		position.y, // Высота не изменяется
		Math.floor(position.z / gridSize) * gridSize + halfGridSize // Смещение в центр квадрата по Z
	);
};

export const initShapeControls = (
	scene: BABYLON.Scene,
	camera: BABYLON.ArcRotateCamera,
	canvas: HTMLCanvasElement,
	options: any,
	shapes: BABYLON.Mesh[]
) => {
	// Начало вращения по указанной оси
	const startRotation = (axis: 'x' | 'y') => {
		if (selectedMesh) {
			rotateAxis = axis;
			isRotating = true;
			camera.detachControl(); // Отключаем управление камерой
		}
	};

	// Остановка вращения
	const stopRotation = () => {
		isRotating = false;
		rotateAxis = null;
		camera.attachControl(canvas, true); // Включаем управление камерой
	};

	// Слушаем события нажатия мыши
	scene.onPointerObservable.add(evt => {
		const pickResult = scene.pick(scene.pointerX, scene.pointerY);
		if (evt.type === BABYLON.PointerEventTypes.POINTERDOWN && pickResult?.hit) {
			if (
				pickResult.pickedMesh === scene.getMeshByName('ground') &&
				pickResult.pickedPoint
			) {
				// Привязываем точку клика к сетке
				const snappedPosition = snapToGrid(pickResult.pickedPoint);

				// Создание новой фигуры на привязанной позиции
				selectedMesh = createShape(scene, snappedPosition, options);
				shapes.push(selectedMesh!);
			} else if (pickResult.pickedMesh) {
				// Перетаскивание фигуры
				selectedMesh = pickResult.pickedMesh as BABYLON.Mesh;
				isDragging = true;
				camera.detachControl(); // Отключаем камеру при перетаскивании
			}
		} else if (evt.type === BABYLON.PointerEventTypes.POINTERUP) {
			isDragging = false;
			stopRotation();
		} else if (
			evt.type === BABYLON.PointerEventTypes.POINTERMOVE &&
			isDragging &&
			selectedMesh
		) {
			// Перетаскивание фигуры
			const newPickResult = scene.pick(scene.pointerX, scene.pointerY);
			if (newPickResult?.hit) {
				const pickedPoint = newPickResult.pickedPoint;

				// Привязываем новую позицию фигуры к сетке
				const snappedPosition = snapToGrid(pickedPoint!);
				selectedMesh.position = new BABYLON.Vector3(
					snappedPosition.x,
					selectedMesh.position.y, // Высота остается без изменений
					snappedPosition.z
				);
			}
		}
	});

	// Управление вращением с помощью клавиш
	window.addEventListener('keydown', event => {
		if (selectedMesh) {
			if (event.key === 'x') {
				startRotation('x');
			} else if (event.key === 'y') {
				startRotation('y');
			}
		}
	});

	window.addEventListener('keyup', event => {
		if (event.key === 'x' || event.key === 'y') {
			stopRotation();
		}
	});

	// Вращение фигуры в цикле рендеринга
	scene.onBeforeRenderObservable.add(() => {
		if (isRotating && selectedMesh) {
			if (rotateAxis === 'x') {
				selectedMesh.rotation.x += 0.01;
			} else if (rotateAxis === 'y') {
				selectedMesh.rotation.y += 0.01;
			}
		}
	});
};
