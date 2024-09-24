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
		const token = localStorage.getItem('token');
		if (token) {
			store.checkAuth().finally(() => {
				setIsReady(true); 
			});
		} else {
			setIsReady(true);
		}
	}, []);

	if (!isReady) {
		return <div>Loading...</div>;
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
