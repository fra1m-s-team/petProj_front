import * as BABYLON from '@babylonjs/core';
import * as CANNON from 'cannon';
import { createGUI } from './gui.ts';
import { initShapeControls } from './shapeControls.ts';
import { createGridMaterial } from './gridForScene.ts';

export const createScene = (canvas: HTMLCanvasElement): BABYLON.Scene => {
	const shapes: BABYLON.Mesh[] = [];

	const engine = new BABYLON.Engine(canvas, true);
	const scene = new BABYLON.Scene(engine);

	window.CANNON = CANNON;
	scene.enablePhysics(
		new BABYLON.Vector3(0, -9.81, 0),
		new BABYLON.CannonJSPlugin()
	);

	const camera = new BABYLON.ArcRotateCamera(
		'camera',
		Math.PI / 2,
		Math.PI / 2,
		10,
		BABYLON.Vector3.Zero(),
		scene
	);
	camera.attachControl(canvas, true);

	const light = new BABYLON.HemisphericLight(
		'light',
		new BABYLON.Vector3(0, 1, 0),
		scene
	);
	light.intensity = 0.7;

	let ground = BABYLON.MeshBuilder.CreateGround(
		'ground',
		{ width: 10, height: 10 },
		scene
	);
	ground.isPickable = true;
	ground.checkCollisions = true;
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(
		ground,
		BABYLON.PhysicsImpostor.BoxImpostor,
		{ mass: 0 },
		scene
	);

	const gridMaterial = createGridMaterial(scene);
	ground.material = gridMaterial;

	const updateGridSize = (width: number, height: number) => {
		ground.dispose();
		ground = BABYLON.MeshBuilder.CreateGround('ground', { width, height }, scene);
		ground.isPickable = true;
		ground.checkCollisions = true;
		ground.physicsImpostor = new BABYLON.PhysicsImpostor(
			ground,
			BABYLON.PhysicsImpostor.BoxImpostor,
			{ mass: 0 },
			scene
		);
		ground.material = gridMaterial;
	};

	const { options } = createGUI(canvas, shapes, updateGridSize);
	initShapeControls(scene, camera, canvas, options, shapes);

	engine.runRenderLoop(() => {
		scene.render();
	});

	window.addEventListener('resize', () => {
		engine.resize();
	});

	return scene;
};
