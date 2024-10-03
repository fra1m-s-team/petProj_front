import * as BABYLON from '@babylonjs/core';
import * as CANNON from 'cannon';
import { createGUI } from './gui.ts';
import { initShapeControls } from './shapeControls.ts';
import { createGridMaterial } from './gridForScene.ts';

export const createScene = (canvas: HTMLCanvasElement): BABYLON.Scene => {
	const shapes: BABYLON.Mesh[] = [];

	const engine = new BABYLON.Engine(canvas, true);
	const scene = new BABYLON.Scene(engine);

	// Подключаем Cannon.js для физики
	window.CANNON = CANNON;
	scene.enablePhysics(
		new BABYLON.Vector3(0, -9.81, 0),
		new BABYLON.CannonJSPlugin()
	);

	// Настраиваем камеру
	const camera = new BABYLON.ArcRotateCamera(
		'camera',
		Math.PI / 2,
		Math.PI / 2,
		10,
		BABYLON.Vector3.Zero(),
		scene
	);
	camera.attachControl(canvas, true);

	// Настраиваем освещение
	const light = new BABYLON.HemisphericLight(
		'light',
		new BABYLON.Vector3(0, 1, 0),
		scene
	);
	light.intensity = 0.7;

	// Создаем землю с сеткой
	const ground = BABYLON.MeshBuilder.CreateGround(
		'ground',
		{ width: 10, height: 10 },
		scene
	);
	ground.isPickable = true; // Земля будет интерактивной
	ground.checkCollisions = true; // Включаем коллизии
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(
		ground,
		BABYLON.PhysicsImpostor.BoxImpostor,
		{ mass: 0 },
		scene
	);

	// Применяем материал с сеткой
	const gridMaterial = createGridMaterial(scene);
	ground.material = gridMaterial;

	const { options } = createGUI(canvas,shapes);

	// Инициализируем управление фигурами
	initShapeControls(scene, camera, canvas, options, shapes);

	// Запускаем цикл рендеринга
	engine.runRenderLoop(() => {
		scene.render();
	});

	// Обновляем размеры canvas при изменении окна
	window.addEventListener('resize', () => {
		engine.resize();
	});

	return scene;
};
