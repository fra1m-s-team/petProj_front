import * as BABYLON from '@babylonjs/core';
import * as dat from 'dat.gui';

export const createGUI = (
	canvas: HTMLCanvasElement,
	shapes: BABYLON.Mesh[],
	updateGridSize: (width: number, height: number) => void
) => {
	const gui = new dat.GUI({ autoPlace: false });
	const guiContainer = document.createElement('div');
	guiContainer.style.position = 'absolute';
	guiContainer.style.top = '10px';
	guiContainer.style.right = '10px';
	canvas.parentElement?.appendChild(guiContainer);
	gui.domElement.style.zIndex = '1';
	guiContainer.appendChild(gui.domElement);

	const options = {
		shape: 'box',
		size: 1,
		color: '#ffffff',
		rotateX: () => {},
		rotateY: () => {},
		collisions: true,
		physicsEnabled: true,
	};

	gui
		.add(options, 'shape', ['box', 'sphere', 'cylinder', 'cone'])
		.onChange(value => {
			options.shape = value;
		});
	// gui.add(options, 'size', 0.1, 5);
	gui.addColor(options, 'color');

	const gridOptions = {
		width: 10,
		height: 10,
	};

	gui
		.add(gridOptions, 'width', 10, 1000, 2)
		.name('Размер сетки')
		.onChange(value => {
			gridOptions.width = value;
			gridOptions.height = value;
			updateGridSize(gridOptions.width, gridOptions.height);
		});

	const clearAllShapes = () => {
		shapes.forEach(shape => {
			shape.dispose();
		});
		shapes.length = 0;
	};

	const undoLastShape = () => {
		if (shapes.length > 0) {
			const lastShape = shapes.pop();
			lastShape?.dispose();
		}
	};

	gui.add({ clearAllShapes }, 'clearAllShapes').name('Очистить все');
	gui.add({ undoLastShape }, 'undoLastShape').name('Отменить последнюю');

	gui
		.add(options, 'physicsEnabled')
		.name('Включить физику')
		.onChange(value => {
			shapes.forEach(shape => {
				if (shape.physicsImpostor) {
					if (value) {
						shape.physicsImpostor.wakeUp();
					} else {
						shape.physicsImpostor.sleep();
					}
				}
			});
		});

	const handleKeyDown = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
			event.preventDefault();
			undoLastShape();
		}
	};
	document.addEventListener('keydown', handleKeyDown);

	return { options, gui };
};
