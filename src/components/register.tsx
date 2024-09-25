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
	Alert,
	Progress,
	Popover,
} from '@mantine/core';
import {
	requirements,
	getStrength,
	PasswordRequirement,
} from '../utils/PasswordUtils';

const RegistrationPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});
	const [popoverOpened, setPopoverOpened] = useState(false);
	const { store } = useContext(Context);
	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setErrorMessage('');

		if (password !== confirmPassword) {
			setErrors({ confirmPassword: 'Пароли не совпадают' });
			return;
		}

		try {
			await store.registration(username, email, password);
			navigate('/');
		} catch (err: any) {
			const serverErrors = err.response?.data || [];
			const fieldErrors: { email?: string; password?: string } = {};

			if (Array.isArray(serverErrors)) {
				serverErrors.forEach((error: string) => {
					if (error.includes('email')) {
						fieldErrors.email = error.split('-')[1];
					} else if (error.includes('password')) {
						fieldErrors.password = error.split('-')[1]; // Ошибка password
					}
				});

				setErrors(fieldErrors);
			}
			setErrorMessage(err.response?.data?.message || 'Неизвестная ошибка');
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

	const strength = getStrength(password);
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';
	const checks = requirements.map((requirement: any, index: any) => (
		<PasswordRequirement
			key={index}
			label={requirement.label}
			meets={requirement.re.test(password)}
		/>
	));

	return (
		<Container size={420} my={40}>
			<Title order={1}>Регистрация</Title>
			{errorMessage && (
				<Alert color='red' mb='md'>
					{errorMessage}
				</Alert>
			)}

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
					error={errors.email}
				/>

				<Popover
					opened={popoverOpened}
					position='bottom'
					width='target'
					transitionProps={{ transition: 'pop' }}
				>
					<Popover.Target>
						<div
							onFocusCapture={() => setPopoverOpened(true)}
							onBlurCapture={() => setPopoverOpened(false)}
						>
							<PasswordInput
								label='Пароль'
								placeholder='Введите пароль'
								value={password}
								onChange={e => setPassword(e.currentTarget.value)}
								required
								mt='md'
								error={errors.password}
							/>
						</div>
					</Popover.Target>
					<Popover.Dropdown>
						<Progress color={color} value={strength} size={5} mb='xs' />
						<PasswordRequirement
							label='Содержит как минимум 6 символов'
							meets={password.length > 5}
						/>
						{checks}
					</Popover.Dropdown>
				</Popover>

				<PasswordInput
					label='Подтвердите пароль'
					placeholder='Введите пароль повторно'
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.currentTarget.value)}
					required
					mt='md'
					error={errors.confirmPassword}
				/>

				<Button fullWidth mt='xl' type='submit'>
					Зарегистрироваться
				</Button>
			</form>
		</Container>
	);
};

export default RegistrationPage;
