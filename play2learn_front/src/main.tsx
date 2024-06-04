import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App'


// import {
// 	Scene,
// 	PerspectiveCamera,
// 	WebGLRenderer,
// 	BoxGeometry,
// 	MeshBasicMaterial,
// 	Mesh,
// 	DirectionalLight,
// } from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';


const loadStyles = async () => {
    const styles = await import('./assets/style.css');
};
loadStyles();




ReactDOM.createRoot(document.getElementById('root')!).render(
	<App/>
);

