import { MantineProvider } from '@mantine/core';
import LoginPage from './auth';
import { initThreeJS } from './scripts/scripts';
import ReactDOM, { createRoot } from 'react-dom/client';
import App from './components/app';
import Store from './store/store';
import { createContext, useEffect, useRef, useState } from 'react';
interface IStore {
	store: Store;
}

const store = new Store();

export const Context = createContext<IStore>({
	store,
});

const loadStyles = async () => {
	const styles = await import('./assets/style.css');
};

loadStyles();

//FIXME: Нужно сделать так, чтобы если опредленные данные ввести (log: admin, pass: admin)
//FIXME: переводил ссылку на игру Apps которая начинается с 26 строки (пока игры показывается, если в 69 строке прописать apps)
const Apps: React.FC = () => {
	const threeContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (threeContainerRef.current) {
			initThreeJS(threeContainerRef.current);
		}
	}, []);

	return (
		<MantineProvider>
			<div id='three-container' ref={threeContainerRef}></div>
		</MantineProvider>
	);
};

// ReactDOM.createRoot(document.getElementById('root')!).render(
// 	<MantineProvider>
// 		<Apps />
// 	</MantineProvider>
// );

function AppInit() {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Suppose you need to delay rendering until some condition is met
		const token = localStorage.getItem('token');
		console.log(token);
		if (token) {
			store.checkAuth().finally(() => {
				setIsReady(true); // Set to true once everything is checked
			});
		} else {
			setIsReady(true); // If no token, set to ready immediately
		}
	}, []);

	if (!isReady) {
		return <div>Loading...</div>; // Or some loading component
	}

	return (
		<Context.Provider value={{ store }}>
			<App />
		</Context.Provider>
	);
}

document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('root');
	if (container) {
		const root = createRoot(container);
		root.render(<AppInit />);
	}
});
