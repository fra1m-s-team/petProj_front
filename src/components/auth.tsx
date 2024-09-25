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
	Modal,
	Group,
	Popover,
  Progress,
} from '@mantine/core';
import {
	getStrength,
	PasswordRequirement,
	requirements,
} from '../utils/PasswordUtils';

const AuthPage = () => {
	const [email, setEmail] = useState('');
	const [resetEmail, setResetEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [errorResetMessage, setErrorResetMessage] = useState('');
	const [popoverOpened, setPopoverOpened] = useState(false);

	const [errors, setErrors] = useState<{
		email?: string;
		resetEmail?: string;
		password?: string;
		code?: string;
		confirmNewPassword?: string;
		newPassword?: string;
	}>({});
	const [modalOpened, setModalOpened] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [code, setCode] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

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

			setErrorMessage(err.response?.data?.message || 'Неизвестная ошибка');
		}
	};

	const handlePasswordReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setErrorResetMessage('');

		// Проверка на совпадение нового пароля и подтверждения
		if (newPassword !== confirmNewPassword) {
			setErrors({
				confirmNewPassword: 'Пароли не совпадают',
			});
			return;
		}

		try {
			await store.resetPassword(resetEmail, newPassword, Number(code));
			setSuccessMessage('Пароль успешно изменён!');
			setModalOpened(false); // Закрыть модальное окно после успешного сброса
		} catch (err: any) {
			const serverErrors = err.response?.data || [];
			const fieldErrors: {
				resetEmail?: string;
				newPassword?: string;
				code?: string;
			} = {};

			if (Array.isArray(serverErrors)) {
				serverErrors.forEach((error: string) => {
					const [errorKey, errorMessage] = error.split('-').map(e => e.trim());

					switch (errorKey) {
						case 'email':
							fieldErrors.resetEmail = errorMessage;
							break;
						case 'newPassword':
							fieldErrors.newPassword = errorMessage;
							break;
						case 'code':
							fieldErrors.code = errorMessage;
							break;
						default:
							break;
					}
				});
				setErrors(fieldErrors);
			}

			console.log(err);
			setErrorResetMessage(err.response?.data?.message || 'Неизвестная ошибка');
		}
	};

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setErrorResetMessage('');
		try {
			await store.sendCode(resetEmail);
			setSuccessMessage('Код успешно отправлен на вашу почту!');
		} catch (err: any) {
			setErrorResetMessage(
				err.response?.data?.message || 'Ошибка при отправке кода'
			);
		}
	};

	const strength = getStrength(newPassword);
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';
	const checks = requirements.map((requirement: any, index: any) => (
		<PasswordRequirement
			key={index}
			label={requirement.label}
			meets={requirement.re.test(newPassword)}
		/>
	));

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

				<Group grow mt='md'>
					<Button type='submit'>Войти</Button>
					<Button variant='light' onClick={() => setModalOpened(true)}>
						Забыли пароль?
					</Button>
				</Group>
			</form>

			<Modal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				title='Сброс пароля'
			>
				{errorResetMessage && (
					<Alert color='red' mb='md'>
						{errorResetMessage}
					</Alert>
				)}
				{successMessage && (
					<Alert color='green' mb='md'>
						{successMessage}
					</Alert>
				)}

				<form onSubmit={handlePasswordReset}>
					<TextInput
						label='Email'
						placeholder='your@email.com'
						required
						value={resetEmail}
						onChange={e => setResetEmail(e.currentTarget.value)}
						mb='md'
						error={errors.resetEmail}
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
									label='Новый пароль'
									placeholder='Ваш новый пароль'
									required
									value={newPassword}
									onChange={e => setNewPassword(e.currentTarget.value)}
									mb='md'
									error={errors.newPassword}
								/>
							</div>
						</Popover.Target>
						<Popover.Dropdown>
							<Progress color={color} value={strength} size={5} mb='xs' />
							<PasswordRequirement
								label='Содержит как минимум 6 символов'
								meets={newPassword.length > 5}
							/>
							{checks}
						</Popover.Dropdown>
					</Popover>

					<PasswordInput
						label='Подтвердите новый пароль'
						placeholder='Подтвердите ваш новый пароль'
						required
						value={confirmNewPassword}
						onChange={e => setConfirmNewPassword(e.currentTarget.value)}
						mb='md'
						error={errors.confirmNewPassword}
					/>

					<Group grow align='center'>
						<TextInput
							label='Код'
							placeholder='Введите код'
							required
							value={code}
							onChange={e => setCode(e.currentTarget.value)}
							mb='md'
							error={errors.code}
						/>
						<Button onClick={handleSendCode}>Получить код</Button>
					</Group>

					<Button fullWidth mt='md' type='submit'>
						Сбросить пароль
					</Button>
				</form>
			</Modal>
		</Container>
	);
};

export default AuthPage;
