//FIXME: [Error] Cannot use wildcard in Access-Control-Allow-Origin when credentials flag is true.
//FIXME: [Error] XMLHttpRequest cannot load http://localhost:5173/auth due to access control checks.
//FIXME: [Error] Failed to load resource: Cannot use wildcard in Access-Control-Allow-Origin when credentials flag is true. (auth, line 0)

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
} from '@mantine/core';

const AuthPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
	}>({});
	const navigate = useNavigate();
	const { store } = useContext(Context);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setErrorMessage(''); 

		try {
			await store.auth(email, password);
			navigate('/');
		} catch (err: any) {
			const serverErrors = err.response?.data || [];
			const fieldErrors: { email?: string; password?: string } = {};

			if (Array.isArray(serverErrors)) {
				serverErrors.forEach((error: any) => {
					if (error.includes('email')) {
						fieldErrors.email = error.split('-')[1]?.trim();
					} else if (error.includes('password')) {
						fieldErrors.password = error.split('-')[1]?.trim();
					}
				});

				setErrors(fieldErrors);
			}

			setErrorMessage(err.response?.data?.message || 'Неизвестная ошибка'); // Устанавливаем сообщение об ошибке
		}
	};

  //FIXME: При вводе на каждый симвл ошибка 401
	// store.checkAuth();

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

			{errorMessage && (
				<Alert color='red' mb='md'>
					{errorMessage}
				</Alert>
			)}

			<form onSubmit={handleLogin}>
				<TextInput
					label='Email'
					placeholder='your@email.com'
					required
					value={email}
					onChange={e => setEmail(e.currentTarget.value)}
					mb='md'
					error={errors.email}
				/>

				<PasswordInput
					label='Пароль'
					placeholder='Ваш пароль'
					required
					value={password}
					onChange={e => setPassword(e.currentTarget.value)}
					mb='md'
					error={errors.password}
				/>

				<Button fullWidth type='submit' mt='md'>
					Войти
				</Button>
			</form>
		</Container>
	);
};

export default AuthPage;
