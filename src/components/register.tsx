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

const RegisterPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { store } = useContext(Context);
	const navigate = useNavigate();

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords don't match");
			return;
		}
		store.reg(username, email, password);
		navigate('/');
	};

	if (localStorage.getItem('token') && store.isAuth) {
		return (
			<Container>
				<Title>Вы уже авторизированы</Title>
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
				/>
				<PasswordInput
					label='Пароль'
					placeholder='Введите пароль'
					value={password}
					onChange={e => setPassword(e.currentTarget.value)}
					required
					mt='md'
				/>
				<PasswordInput
					label='Подтвердитепароль'
					placeholder='Введите пароль повторно'
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.currentTarget.value)}
					required
					mt='md'
				/>
				<Button fullWidth mt='xl' type='submit'>
					Зарегистрироваться
				</Button>
			</form>
		</Container>
	);
};

export default RegisterPage;
