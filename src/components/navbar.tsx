import { useContext, useState } from 'react';
import { Context } from '../main';
import { Button, Drawer, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LoginPage from './auth';
import RegisterPage from './register';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = () => {
	const navigate = useNavigate();
	let { store } = useContext(Context);
	const [opened, { toggle, close }] = useDisclosure(false);
	const [currentView, setCurrentView] = useState(''); // Для управления отображением разных компонентов

	return (
		<>
			<Burger opened={opened} onClick={toggle} size='sm' />
			<Drawer
				opened={opened}
				onClose={close}
				padding='md'
				size='md'
				position='left'
				title='Menu'
				withCloseButton={false}
			>
				<Group >
					<Button
						onClick={() => {
							navigate('/');
							close();
						}}
					>
						Main
					</Button>{' '}
					<Button onClick={() => setCurrentView('login')}>Login</Button>
					<Button onClick={() => setCurrentView('register')}>Register</Button>
					<Button
						onClick={() => {
							store.logout();
							navigate('/');
							close();
						}}
					>
						Logout
					</Button>
				</Group>

				{currentView === 'login' && <LoginPage />}
				{currentView === 'register' && <RegisterPage />}
			</Drawer>
		</>
	);
};

export default NavigationButtons;
