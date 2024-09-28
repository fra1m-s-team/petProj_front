import * as BABYLON from '@babylonjs/core';
import * as dat from 'dat.gui'; // Импортируем dat.GUI

let selectedShape: string = 'box'; // По умолчанию выбираем квадрат (box)
let meshes: BABYLON.Mesh[] = []; // Массив для хранения всех созданных фигур
let lastMesh: BABYLON.Mesh | null = null; // Храним последнюю созданную фигуру

export const createScene = (canvas: HTMLCanvasElement): BABYLON.Scene => {
	const engine = new BABYLON.Engine(canvas, true);
	const scene = new BABYLON.Scene(engine);

	// Создаем камеру
	const camera = new BABYLON.ArcRotateCamera(
		'camera',
		Math.PI / 2,
		Math.PI / 2,
		10,
		BABYLON.Vector3.Zero(),
		scene
	);
	camera.attachControl(canvas, true);

	// Добавляем освещение
	const light = new BABYLON.HemisphericLight(
		'light',
		new BABYLON.Vector3(0, 1, 0),
		scene
	);
	light.intensity = 0.7;

	// Добавляем пол
	const ground = BABYLON.MeshBuilder.CreateGround(
		'ground',
		{ width: 10, height: 10 },
		scene
	);
	ground.isPickable = true; // Делаем пол "подбираемым" для кликов

	// Создаем GUI
	const gui = new dat.GUI(); // Создаем новый экземпляр dat.GUI
	gui.domElement.style.position = 'absolute';
	gui.domElement.style.top = '10px'; // Устанавливаем положение GUI
	gui.domElement.style.left = '10px'; // Устанавливаем положение GUI


	const options = {
		shape: 'box',
		size: 1,
		color: '#ffffff',
	};

	gui
		.add(options, 'shape', ['box', 'sphere', 'cylinder', 'cone'])
		.onChange(value => {
			selectedShape = value;
			console.log(`Выбрана фигура: ${selectedShape}`);
		});

	gui.add(options, 'size', 0.1, 5);
	gui.addColor(options, 'color');

	// Кнопка "Очистить все фигуры"
	gui
		.add({ clearAll: () => clearAllShapes(scene) }, 'clearAll')
		.name('Очистить все');

	// Кнопка "Отменить последнюю фигуру"
	gui
		.add({ undoLast: () => undoLastShape(scene) }, 'undoLast')
		.name('Отменить последнюю');

	// Функция для удаления всех фигур
	const clearAllShapes = (scene: BABYLON.Scene) => {
		meshes.forEach(mesh => mesh.dispose()); // Удаляем все фигуры
		meshes = [];
	};

	// Функция для отмены последней добавленной фигуры
	const undoLastShape = (scene: BABYLON.Scene) => {
		if (lastMesh) {
			lastMesh.dispose(); // Удаляем последнюю фигуру
			meshes.pop(); // Убираем её из списка фигур
			lastMesh = meshes[meshes.length - 1] || null; // Обновляем последнюю фигуру
		}
	};

	// Функция для создания фигуры
	const createShape = (
		scene: BABYLON.Scene,
		shape: string,
		size: number,
		color: string,
		position: BABYLON.Vector3
	) => {
		let newMesh: BABYLON.Mesh | null = null;

		switch (shape) {
			case 'box':
				newMesh = BABYLON.MeshBuilder.CreateBox(shape, { size }, scene);
				break;
			case 'sphere':
				newMesh = BABYLON.MeshBuilder.CreateSphere(
					shape,
					{ diameter: size },
					scene
				);
				break;
			case 'cylinder':
				newMesh = BABYLON.MeshBuilder.CreateCylinder(
					shape,
					{ diameterTop: size, diameterBottom: size, height: 2 },
					scene
				);
				break;
			case 'cone':
				newMesh = BABYLON.MeshBuilder.CreateCylinder(
					shape,
					{ diameterTop: 0, diameterBottom: size, height: 2 }, // Диаметр верха 0 делает конус
					scene
				);
				break;
		}

		if (newMesh) {
			// Смещаем фигуры (цилиндр и конус) так, чтобы они не оказывались частично ниже пола
			if (shape === 'cylinder' || shape === 'cone') {
				position.y = 1; // Высота цилиндра и конуса — 2, поэтому поднимаем на половину высоты
			} else {
				position.y = size / 2; // Для остальных фигур поднимаем на половину их размера
			}

			newMesh.position = position; // Устанавливаем позицию фигуры

			// Устанавливаем цвет материала
			const material = new BABYLON.StandardMaterial('material', scene);
			material.diffuseColor = BABYLON.Color3.FromHexString(color);
			newMesh.material = material;

			meshes.push(newMesh); // Добавляем фигуру в массив
			lastMesh = newMesh; // Сохраняем последнюю фигуру
		}
	};

	// Обработчик кликов по сцене
	scene.onPointerObservable.add(evt => {
		if (evt.type === BABYLON.PointerEventTypes.POINTERDOWN) {
			// Определяем место клика на сцене
			const pickResult = scene.pick(scene.pointerX, scene.pointerY);

			// Проверяем, что было попадание в объект и что это пол
			if (
				pickResult &&
				pickResult.hit &&
				pickResult.pickedMesh === ground &&
				pickResult.pickedPoint
			) {
				const clickedPosition = pickResult.pickedPoint.clone(); // Получаем координаты клика и клонируем точку

				// Смещаем фигуру на пол (не во внутрь)
				createShape(
					scene,
					selectedShape,
					options.size,
					options.color,
					clickedPosition
				);
			}
		}
	});

	// Запускаем рендеринг
	engine.runRenderLoop(() => {
		scene.render();
	});

	return scene;
};
