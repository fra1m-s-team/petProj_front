// services/scene/sceneUtils.ts
import * as BABYLON from '@babylonjs/core';

export const saveSceneAsJSON = (scene: BABYLON.Scene): string => {
	const serializedScene = BABYLON.SceneSerializer.Serialize(scene);
	return JSON.stringify(serializedScene); // Преобразуем в JSON строку
};

export const handleSaveScene = async (scene: BABYLON.Scene) => {
	const jsonScene = await saveSceneAsJSON(scene); // Получаем JSON-строку сцены
	console.log(jsonScene);
	return jsonScene;
	// saveToDatabase(jsonScene); // Сохраняем в БД
};
