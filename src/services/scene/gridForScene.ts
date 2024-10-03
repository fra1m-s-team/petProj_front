import * as BABYLON from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';


export const createGridMaterial = (scene: BABYLON.Scene) => {
	const gridMaterial = new GridMaterial('gridMaterial', scene);
	gridMaterial.majorUnitFrequency = 1; // Интервалы для крупных клеток
	gridMaterial.minorUnitVisibility = 0; // Отключаем мелкие линии
	gridMaterial.gridRatio = 1; // Размер клетки 1x1
	gridMaterial.backFaceCulling = false;
	gridMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
	gridMaterial.lineColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Цвет линий
	gridMaterial.opacity = 0.8;
	return gridMaterial;
};
