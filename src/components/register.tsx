import React, { useContext, useState } from 'react';
import { Context } from '../main';
import { useNavigate } from 'react-router-dom';
import {
	Container,
	TextInput,
	PasswordInput,
	Button,
	Title,
	Text,
} from '@mantine/core';

const RegistrationPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});
	const { store } = useContext(Context);
	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Проверяем, совпадают ли пароли
		if (password !== confirmPassword) {
			setErrors({ confirmPassword: 'Пароли не совпадают' });
		}

		try {
			await store.registration(username, email, password);
			navigate('/');
		} catch (err: any) {
			const serverErrors = err.response?.data || [];
			const fieldErrors: { email?: string; password?: string } = {};

			// Обрабатываем ошибки с сервера и добавляем их к соответствующим полям
			serverErrors.forEach((error: string) => {
				if (error.includes('email')) {
					fieldErrors.email = error.split('-')[1];
				} else if (error.includes('password')) {
					fieldErrors.password = error.split('-')[1]; // Ошибка password
				}
			});

			setErrors(fieldErrors);
		}
	};

	if (localStorage.getItem('token') && store.isAuth) {
		return (
			<Container>
				<Title>Вы уже авторизованы</Title>
				<Text>Пользователь: {store.user.name}</Text>
			</Container>
		);
	}

	return (
		<Container size={420} my={40}>
			<Title order={1}>Регистрация</Title>

			<form onSubmit={handleRegister}>
				<TextInput
					label='Имя пользователя'
					placeholder='Введите имя'
					value={username}
					onChange={e => setUsername(e.currentTarget.value)}
					required
				/>

				<TextInput
					label='Email'
					type='email'
					placeholder='youremail@mail.com'
					value={email}
					onChange={e => setEmail(e.currentTarget.value)}
					required
					mt='md'
					error={errors.email} // Выводим ошибку под полем email
				/>

				<PasswordInput
					label='Пароль'
					placeholder='Введите пароль'
					value={password}
					onChange={e => setPassword(e.currentTarget.value)}
					required
					mt='md'
					error={errors.password} // Выводим ошибку под полем password
				/>

				<PasswordInput
					label='Подтвердите пароль'
					placeholder='Введите пароль повторно'
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.currentTarget.value)}
					required
					mt='md'
					error={errors.confirmPassword} // Выводим ошибку под полем confirmPassword
				/>

				<Button fullWidth mt='xl' type='submit'>
					Зарегистрироваться
				</Button>
			</form>
		</Container>
	);
};

export default RegistrationPage;
