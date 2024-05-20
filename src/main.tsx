import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	DirectionalLight,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import LoginPage from './auth';

// FIXME: Вынести все в папку scripts
// Создание сцены
const scene = new Scene();
const rendever = new WebGLRenderer();
const loader = new GLTFLoader();

loader.load(
	'src/static/models/123.glb',
	glb => {
		console.log('add');
		console.log(glb);
		const mod = glb.scene;
		scene.add(mod);
	},
	progress => {
		console.log('progress');
		console.log(progress);
	},
	errr => {
		console.log('ERR');
		console.log(errr);
	}
);

const light2 = new DirectionalLight(0xffffff, 2); // цвет света (красный), интенсивность
light2.position.set(3, 0, 5); // позиция источника света
scene.add(light2);

const light = new DirectionalLight(0xffffff, 2);
light.position.set(3, 5, 0);
scene.add(light);

const size = {
	width: window.innerWidth,
	heigth: window.innerHeight,
};

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
// scene.add(cube);

const camera = new PerspectiveCamera(
	50,
	0.5 * (size.width / size.heigth),
	1,
	10000
);
camera.position.z = 1500;

const controls = new OrbitControls(camera, rendever.domElement);
controls.enableDamping = true;

rendever.setSize(size.width, size.heigth);
rendever.setPixelRatio(Math.min(window.devicePixelRatio, 2));
rendever.shadowMap.enabled = true;
document.body.appendChild(rendever.domElement);

// const theme = createTheme({
// 	spacing: {
// 		centered: '0 auto', // Центрирование элементов
// 	},
// 	// Другие свойства темы...
// });

// ReactDOM.createRoot(document.getElementById('root')!).render(
// 	<MantineProvider>
// 		<LoginPage />
// 	</MantineProvider>
// );


const animate = () => {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	rendever.render(scene, camera);
};

animate();
