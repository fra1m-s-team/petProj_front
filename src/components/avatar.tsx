import { useContext, useState } from 'react';
import { Context } from '../main';
import { Button, Drawer, Group, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AuthPage from './auth';
import RegistrationPage from './register';
import { Route, useNavigate } from 'react-router-dom';
import UpdateUserPage from './updateUser';

const AvatarButtons = () => {
	const navigate = useNavigate();
	let { store } = useContext(Context);
	const [opened, { toggle, close }] = useDisclosure(false);
	const [currentView, setCurrentView] = useState('');

	const userName = store.user.name;
	const isAuth = store.isAuth;

	return (
		<>
			<Avatar
				// src={'/path/to/avatar.jpg'} // Можете указать путь к аватарке
				alt='Profile'
				radius='xl'
				onClick={toggle}
				style={{ cursor: 'pointer' }}
			/>{' '}
			<Drawer
				opened={opened}
				onClose={close}
				padding='md'
				size='md'
				position='left'
				title='Profile'
				// styles={{
				// 	content: { height: '50vh' }, // Указываем высоту панели, например 50% экрана
				// }}
			>
				<Group grow>
					{!isAuth && (
						<>
							<Button onClick={() => setCurrentView('login')}>Login</Button>
							<Button onClick={() => setCurrentView('register')}>
								Register
							</Button>
						</>
					)}
					{isAuth && (
						<>
							<Button
								onClick={() => {
									navigate('/profile');
									close();
								}}
							>
								{userName || 'User'}
							</Button>
							<Button
								onClick={async () => {
									await store.logout();
									navigate('/');
									close();
								}}
							>
								Logout
							</Button>
							<Button onClick={() => setCurrentView('updateUser')}>
								Change password
							</Button>
						</>
					)}
				</Group>

				{currentView === 'login' && <AuthPage />}
				{currentView === 'register' && <RegistrationPage />}
				{currentView === 'updateUser' && <UpdateUserPage />}
			</Drawer>
		</>
	);
};

export default AvatarButtons;
