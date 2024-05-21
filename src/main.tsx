import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';

import LoginPage from './auth';


const loadStyles = async () => {
    const styles = await import('./assets/style.css');
    
};

loadStyles();


ReactDOM.createRoot(document.getElementById('root')!).render(
	<MantineProvider>
		<LoginPage />
	</MantineProvider>
);



