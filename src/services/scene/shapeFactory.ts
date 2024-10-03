import * as BABYLON from '@babylonjs/core';

// Применение физики и материала к объекту
export const applyPhysicsAndMaterial = (
	mesh: BABYLON.Mesh,
	color: string,
	scene: BABYLON.Scene,
	physicsEnabled: boolean // Добавляем флаг для включения/отключения физики
) => {
	// Включаем коллизии для всех объектов
	mesh.checkCollisions = true;

	if (physicsEnabled) {
		// Применяем физику, если она включена
		mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
			mesh,
			BABYLON.PhysicsImpostor.BoxImpostor, // Используем импостер коробки
			{ mass: 1, restitution: 0.9 },
			scene
		);
	} else {
		// Если физика отключена, коллизии все равно работают
		mesh.checkCollisions = true;
	}

	const material = new BABYLON.StandardMaterial('material', scene);
	material.diffuseColor = BABYLON.Color3.FromHexString(color);
	mesh.material = material;
};

// Фабрика для создания фигур
export const createShape = (
	scene: BABYLON.Scene,
	position: BABYLON.Vector3,
  options: any
) => {
	let newMesh: BABYLON.Mesh | null = null;

	// Создаем фигуру в зависимости от типа
	switch (options.shape) {
		case 'box':
			newMesh = BABYLON.MeshBuilder.CreateBox(options.shape, { size: options.size }, scene);
			break;
		case 'sphere':
			newMesh = BABYLON.MeshBuilder.CreateSphere(
				options.shape,
				{ diameter: options.size },
				scene
			);
			break;
		case 'cylinder':
			newMesh = BABYLON.MeshBuilder.CreateCylinder(
				options.shape,
				{ diameterTop: options.size, diameterBottom: options.size, height: 2 },
				scene
			);
			break;
		case 'cone':
			newMesh = BABYLON.MeshBuilder.CreateCylinder(
				options.shape,
				{ diameterTop: 0, diameterBottom: options.size, height: 2 },
				scene
			);
			break;
	}

	// Коррекция позиции фигуры по высоте
	if (newMesh) {
		const heightAdjustment =
			options.shape === 'cylinder' || options.shape === 'cone' ? options.size / 2 : 0;
		newMesh.position = new BABYLON.Vector3(
			position.x,
			options.size / 2 + heightAdjustment,
			position.z
		);

		// Применяем физику или коллизии в зависимости от флага
		applyPhysicsAndMaterial(newMesh, options.color, scene, options.physicsEnabled);
	}

	return newMesh;
};
