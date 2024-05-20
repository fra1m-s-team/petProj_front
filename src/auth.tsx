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

interface LoginFormProps {
	onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
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

	return (
		<Container size='xs'>
			<Title style={{ textAlign: 'center' }} mt='lg'>
				Login
			</Title>
			{error && (
				<Alert title='Error' color='red' mt='md'>
					{error}
				</Alert>
			)}
			<form onSubmit={handleSubmit}>
				<TextInput
					label='Username'
					placeholder='Your username'
					value={username}
					onChange={e => setUsername(e.currentTarget.value)}
					required
					mt='md'
				/>
				<PasswordInput
					label='Password'
					placeholder='Your password'
					value={password}
					onChange={e => setPassword(e.currentTarget.value)}
					required
					mt='md'
				/>
				<Button type='submit' fullWidth mt='xl'>
					Login
				</Button>
			</form>
		</Container>
	);
};

const LoginPage: React.FC = () => {
	const handleLogin = (username: string, password: string) => {
		console.log('Login attempt', { username, password });
		// Implement your authentication logic here
	};

	return <LoginForm onLogin={handleLogin} />;
};

export default LoginPage;
