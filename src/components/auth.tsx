import React, { useContext, useState } from 'react';
import { Context } from '../main';
import { useNavigate } from 'react-router-dom';
import {
	Button,
	TextInput,
	Container,
	Title,
	PasswordInput,
	Alert,
} from '@mantine/core'; // Импорт компонентов Mantine

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	let { store } = useContext(Context);

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		store.login(email, password);
		navigate('/');
	};

	store.checkAuth();

	if (localStorage.getItem('token') && store.isAuth) {
		return (
			<Container>
				<Alert title='Вы уже авторизованы' color='green'>
					Добро пожаловать, {store.user.name}!
				</Alert>
			</Container>
		);
	}

	return (
		<Container size={420} my={40}>
			<Title order={1}>Войти</Title>

			<form onSubmit={handleLogin}>
				<TextInput
					label='Email'
					placeholder='your@email.com'
					required
					value={email}
					onChange={e => setEmail(e.currentTarget.value)}
					mb='md'
				/>

				<PasswordInput
					label='Пароль'
					placeholder='Ваш пароль'
					required
					value={password}
					onChange={e => setPassword(e.currentTarget.value)}
					mb='md'
				/>

				<Button fullWidth type='submit' mt='md'>
					Войти
				</Button>
			</form>
		</Container>
	);
};

export default LoginPage;
