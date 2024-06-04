// import { MantineProvider } from '@mantine/core';
// import React from 'react';
// import ReactDOM from 'react-dom/client';
import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	DirectionalLight,
	Group,
	Object3D,
	PointLightHelper,
	DirectionalLightHelper,
	PlaneGeometry,
	PCFSoftShadowMap,
	VSMShadowMap,
	ACESFilmicToneMapping,
	Fog,
	ReinhardToneMapping,
	CineonToneMapping,
	SkeletonHelper,
	Vector3,
	Box3,
	Box3Helper,
	IcosahedronGeometry,
	MeshLambertMaterial,
	BufferGeometry,
	AxesHelper,
	MeshNormalMaterial,
	Clock,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
	FirstPersonControls,
	GLTFLoader,
	OBJLoader,
} from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js';
import * as OIMO from 'oimo';
import * as CANNON from 'cannon-es';
import CannonDebugRenderer from 'cannon-es-debugger';
import CannonUtils from 'cannon-utils';

const loadModel = (url: string): Promise<Group> => {
	const loader = new GLTFLoader();
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			glb => resolve(glb.scene),
			undefined,
			error => reject(error)
		);
	});
};

const addClonedModelRandomlyAboveTerrain = (
	scene: Scene,
	model: Object3D,
	count: number,
	range: number,
	world?: OIMO.World
) => {
	model.traverse(node => {
		if (node instanceof Mesh) {
			node.castShadow = true; // Модель будет отбрасывать тени
		}
	});
	const boxHelpers: Box3Helper[] = [];
	for (let i = 0; i < count; i++) {
		const clone = model.clone();
		const x = Math.random() * range - range / 2;
		const z = Math.random() * range - range / 2;
		const y = 1;
		clone.position.set(x, y, z);
		const boxHelper = addPhysicsBody(scene, clone, world);
		scene.add(clone);
		scene.add(boxHelper);
	}
	return boxHelpers;
};

// Функция добавления физического тела к объекту
const addPhysicsBody = (
	scene: Scene,
	model: Object3D,
	world: OIMO.World,
	isStatic: boolean = false
) => {
	const geometry = model.geometry;
	const boxHelpers = [];

	// Пробегаемся по каждой вершине в геометрии и создаем маленькие ящики
	const positions = geometry.attributes.position.array;
	for (let i = 0; i < positions.length; i += 9) {
		// Итерируем по треугольникам (каждые 9 значений)
		const vertices = [
			new Vector3(positions[i], positions[i + 1], positions[i + 2]),
			new Vector3(positions[i + 3], positions[i + 4], positions[i + 5]),
			new Vector3(positions[i + 6], positions[i + 7], positions[i + 8]),
		];

		const center = new Vector3();
		vertices.forEach(vertex => center.add(vertex));
		center.divideScalar(3);

		const size = new Vector3();
		size.subVectors(vertices[0], center).multiplyScalar(2);

		const body = world.add({
			type: 'box',
			size: [size.x, size.y, size.z],
			pos: [center.x, center.y, center.z],
			rot: [0, 0, 0],
			move: !isStatic,
			density: 1,
		});

		model.userData.physicsBody = body;

		// Создаем Box3Helper для отображения границ коллизий
		const box = new Box3().setFromObject(model);
		const boxHelper = new Box3Helper(box, 0xff0000);
		scene.add(boxHelper);
		boxHelpers.push(boxHelper);
	}

	return boxHelpers;
};

function updatePhysics(world, model) {
	const fixedTimeStep = 1.0 / 60.0; // Фиксированный временной шаг для симуляции
	const maxSubSteps = 10; // Максимальное количество подшагов для симуляции

	// Обновление мира физики
	world.step(fixedTimeStep, delta, maxSubSteps);

	// Обновление позиций и ориентации мешей на основе физических тел
	model.traverse(node => {
		if (node instanceof Mesh && node.userData.physicsBody) {
			const body = node.userData.physicsBody;
			node.position.copy(body.position);
			node.quaternion.copy(body.quaternion);
		}
	});
}

const addPhysicsBody2 = (scene, model, world, isStatic = false) => {
	if (!(model instanceof Group)) {
		console.error('Model is not an instance of Group.');
		return;
	}

	// Обходим все объекты в группе
	model.traverse(child => {
		if (child instanceof Mesh) {
			const geometry = child.geometry;

			if (!geometry) {
				console.error('Geometry is not available for mesh:', child);
				return;
			}

			// Получаем вершины геометрии
			let vertices = [];
			if (geometry instanceof BufferGeometry && geometry.attributes.position) {
				const positions = geometry.attributes.position.array;
				for (let i = 0; i < positions.length; i += 3) {
					vertices.push(
						new CANNON.Vec3(positions[i], positions[i + 1], positions[i + 2])
					);
				}
			} else {
				console.error('Invalid geometry format for mesh:', child);
				return;
			}

			// Создаем форму ConvexPolyhedron
			const convexShape = new CANNON.ConvexPolyhedron({
				vertices: vertices,
			});

			// Создаем физическое тело
			const body = new CANNON.Body({
				mass: isStatic ? 0 : 1, // Масса 0 делает объект статическим
			});

			// Добавляем форму коллизии к физическому телу
			body.addShape(convexShape);

			// Устанавливаем начальное положение объекта
			const position = new CANNON.Vec3(
				child.position.x,
				child.position.y,
				child.position.z
			);
			const quaternion = new CANNON.Quaternion(
				child.quaternion.x,
				child.quaternion.y,
				child.quaternion.z,
				child.quaternion.w
			);
			body.position.copy(position);
			body.quaternion.copy(quaternion);

			// Добавляем физическое тело в мир
			world.addBody(body);

			// Сохраняем ссылку на физическое тело в пользовательских данных объекта
			child.userData.physicsBody = body;
		}
	});
};

// threeScript.ts
export const initThreeJS = async (container: HTMLElement) => {
	// Добавляем объект tree в сцену
	const scene = new Scene();
	// scene.fog = new Fog(0x556b2f, 10, 150); //туман
	// const world = new OIMO.World({
	// 	timestep: 1 / 60,
	// 	iterations: 8,
	// 	broadphase: 2,
	// 	worldscale: 1,
	// 	random: true,
	// 	info: false,
	// 	gravity: [0, -9.8, 0],
	// });
	scene.add(new AxesHelper(1000));
	const world = new CANNON.World();
	world.gravity.set(0, -9.82, 0);

	// Load models asynchronously
	const tera = await loadModel('src/static/models/tera.glb');
	tera.traverse(node => {
		if (node instanceof Mesh) {
			node.receiveShadow = true; // Модель будет получать тени
		}
	});
	scene.add(tera);
	addPhysicsBody2(scene, tera, world, true);
	// Добавление физического тела для модели `tera`, чтобы оно было статичным (неподвижным)
	TODO: console.log('Tera model added to the scene', tera);

	const debugRenderer = new CannonDebugRenderer(scene, world);
	// const skeleton = new SkeletonHelper(model);
	// skeleton.visible = false;

	const tree = await loadModel('src/static/models/tree_3.glb');
	scene.add(tree);
	// addPhysicsBody2(scene, tree, world);
	// tree.position.set(0, 0, 0); // Установите начальную позицию для дерева
	// scene.add(tree);
	let monkeyMesh1: Object3D;
	let monkeyBody1: CANNON.Body;
	let monkeyLoaded1 = false;
	const loader = new GLTFLoader();
	const normalMaterial = new MeshNormalMaterial();

	loader.load(
		// Путь к glb файлу
		'src/static/models/tree_2.glb',
		// Функция обратного вызова, которая вызывается, когда загрузка завершена
		object => {
			scene.add(object.scene);
			monkeyMesh1 = object.scene.children[0];
			(monkeyMesh1 as Mesh).material = normalMaterial;
			monkeyMesh1.position.x = 0;
			monkeyMesh1.position.y = 20;
			monkeyMesh1.position.z = 0;
			const monkeyShape = CannonUtils.CreateTriMesh(monkeyMesh1 as Mesh);
			monkeyBody1 = new CANNON.Body({ mass: 1 });
			monkeyBody1.addShape(monkeyShape);

			// monkeyBody.addShape(new CANNON.Plane());
			// monkeyBody.quaternion.setFromAxisAngle(
			// 	new CANNON.Vec3(1, 0, 0),
			// 	Math.PI / 2
			// );
			monkeyBody1.position.x = monkeyMesh1.position.x;
			monkeyBody1.position.y = monkeyMesh1.position.y;
			monkeyBody1.position.z = monkeyMesh1.position.z;
			world.addBody(monkeyBody1);
			monkeyLoaded1 = true;
		},

		// Функция обратного вызова, которая вызывается во время загрузки
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + '% загружено');
		}
	);
	let monkeyMesh: Object3D;
	let monkeyBody: CANNON.Body;
	let monkeyLoaded = false;
	loader.load(
		// Путь к glb файлу
		'src/static/models/tree_3.glb',
		// Функция обратного вызова, которая вызывается, когда загрузка завершена
		object => {
			scene.add(object.scene);
			monkeyMesh = object.scene.children[0];
			(monkeyMesh as Mesh).material = normalMaterial;
			monkeyMesh.position.x = 0;
			monkeyMesh.position.y = 1;
			monkeyMesh.position.z = 0;
			const monkeyShape = CannonUtils.CreateTriMesh(monkeyMesh as Mesh);
			monkeyBody = new CANNON.Body({ mass: 0 });
			monkeyBody.addShape(monkeyShape);

			// monkeyBody.addShape(new CANNON.Plane());
			// monkeyBody.quaternion.setFromAxisAngle(
			// 	new CANNON.Vec3(1, 0, 0),
			// 	Math.PI / 2
			// );
			monkeyBody.position.x = monkeyMesh.position.x;
			monkeyBody.position.y = monkeyMesh.position.y;
			monkeyBody.position.z = monkeyMesh.position.z;
			world.addBody(monkeyBody);
			monkeyLoaded = true;
		},

		// Функция обратного вызова, которая вызывается во время загрузки
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + '% загружено');
		}
	);
	const tree_2 = await loadModel('src/static/models/tree_2.glb');
	console.log('Tree model added to the scene', tree);

	const stone = await loadModel('src/static/models/stone_1.glb');
	console.log('Stone model added to the scene', stone);

	// const treeBoxHelper = await addClonedModelRandomlyAboveTerrain(
	// 	scene,
	// 	tree,
	// 	200,
	// 	100,
	// 	world
	// );TODO:
	// await addClonedModelRandomlyAboveTerrain(scene, tree_2, 2000, 1000, 0);
	// await addClonedModelRandomlyAboveTerrain(scene, stone, 2000, 1000, 0);

	const directionalLight = new DirectionalLight(0xffffff, 5);
	directionalLight.position.set(300, 300, 100);
	directionalLight.castShadow = true;
	directionalLight.shadow.camera.near = 0.01;
	directionalLight.shadow.camera.far = 1000;
	directionalLight.shadow.camera.right = 500;
	directionalLight.shadow.camera.left = -500;
	directionalLight.shadow.camera.top = 500;
	directionalLight.shadow.camera.bottom = -500;
	directionalLight.shadow.mapSize.width = 10000; // Уменьшение размера карты теней
	directionalLight.shadow.mapSize.height = 10000;
	directionalLight.shadow.radius = 3;
	directionalLight.shadow.bias = -0.00001;
	directionalLight.shadow.normalBias = 0.05; // Этот параметр устанавливает, насколько далеко свет должен отходить от поверхности, прежде чем считаться видимым

	// Добавляем "tera" в список объектов, которые принимают тени
	directionalLight.shadow.camera.layers.mask = 0b0001;

	scene.add(directionalLight);

	const orbitRadius = 500; // Радиус орбиты
	const orbitSpeed = 0.00001; // Скорость вращения

	// Создаем объект, вокруг которого будет вращаться свет
	const orbitCenter = new Object3D();
	scene.add(orbitCenter);

	const lightHelpre = new DirectionalLightHelper(directionalLight, 10);
	scene.add(lightHelpre);

	const size = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	const renderer = new WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(size.width, size.height);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFSoftShadowMap;
	renderer.toneMapping = CineonToneMapping;
	container.appendChild(renderer.domElement);

	const camera = new PerspectiveCamera(45, size.width / size.height, 1, 10000);
	camera.rotation.order = 'YXZ';
	camera.position.set(0, 30, 6);
	// const controls = new FirstPersonControls(camera, renderer.domElement);
	// controls.movementSpeed = 20;
	// controls.activeLook = false;
	// // controls.lookSpeed = 0.05;
	// // controls.lookVertical = true;
	console.log('add camera');

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.target.y = 0.5;

	const stats = new Stats();
	stats.dom.style.position = 'absolute';
	stats.dom.style.top = '0px';
	container.appendChild(stats.dom);

	const clock = new Clock();
	let delta;

	const animate = () => {
		stats.update(); // Обновление FPS счетчика
		controls.update(0.1);

		if (monkeyLoaded) {
			monkeyMesh.position.set(
				monkeyBody.position.x,
				monkeyBody.position.y,
				monkeyBody.position.z
			);
			monkeyMesh.quaternion.set(
				monkeyBody.quaternion.x,
				monkeyBody.quaternion.y,
				monkeyBody.quaternion.z,
				monkeyBody.quaternion.w
			);
		}

		if (monkeyLoaded1) {
			monkeyMesh1.position.set(
				monkeyBody1.position.x,
				monkeyBody1.position.y,
				monkeyBody1.position.z
			);
			monkeyMesh1.quaternion.set(
				monkeyBody1.quaternion.x,
				monkeyBody1.quaternion.y,
				monkeyBody1.quaternion.z,
				monkeyBody1.quaternion.w
			);
		}

		delta = Math.min(clock.getDelta(), 0.1);
		world.step(delta);

		// Вычисляем новое положение света TODO:
		// treeBoxHelper.forEach(helper => {
		// 	const box = new Box3().setFromObject(helper.parent as Object3D);
		// 	helper.box.copy(box);
		// });
		debugRenderer.update();

		const angle = Date.now() * orbitSpeed;
		const x = Math.cos(angle) * orbitRadius;
		const y = Math.sin(angle) * orbitRadius;
		// directionalLight.position.set(x, y, 100); TODO:
		lightHelpre.update();

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	};

	window.addEventListener('resize', () => {
		const size = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		camera.updateProjectionMatrix();
		renderer.setSize(size.width, size.height);
	});
	animate();
};
