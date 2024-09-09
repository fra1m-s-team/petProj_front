import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';
import App from './components/app';
import Store from './store/store';
import { createContext, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
interface IStore {
	store: Store;
}

const store = new Store();

export const Context = createContext<IStore>({
	store,
});

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
			<MantineProvider>
				<App />
			</MantineProvider>
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
