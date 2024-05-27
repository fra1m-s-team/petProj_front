// src/components/Login.tsx

import React, { useState } from 'react';
import {
	Button,
	TextInput,
	PasswordInput,
	Container,
	Title,
	Alert,
} from '@mantine/core';

import useFetch from './useFetch';

interface LoginFormProps {
	onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (username.trim() === '' || password.trim() === '') {
			setError('Please enter both username and password');
			return;
		}
		setError('');
		onLogin(username, password);
	};


	// изменение значения password
	const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; })  => {
		setPassword(e.target.value);
	}
	// изменение значение password
	const handleUserChange = (e: { target: { value: React.SetStateAction<string>; }; })  => {
		setUsername(e.target.value);
	}
	
	return (
		<form onSubmit={handleSubmit} className='login_form'>
			<Title>
				Login
			</Title>
			{error && (
				<Alert title='Error' color='red' mt='md'>
					{error}
				</Alert>
			)}
			<TextInput
				label='E-mail'
				placeholder='Введите email'
				value={username}
				onChange={handleUserChange}
				required
				mt='md'
			/>
			<Container className='password_input'>
				<PasswordInput
					label='Password'
					placeholder='Введите пароль'
					value={password}
					onChange={handlePasswordChange}
					required
					mt='md'
				/>
			</Container>
			<Button type='submit' fullWidth mt='xl'>
				Login
			</Button>
		</form>
	);
};

const LoginPage: React.FC = () => {
	const handleLogin = (username: string, password: string) => {
		//console.log('Login attempt', { username, password });
		// Implement your authentication logic here
		const data = useFetch('http://localhost:8080/user/auth',"POST",
								{email: username, password: password});
  		
	};

	return <LoginForm onLogin={handleLogin} />;
};

export default LoginPage;

