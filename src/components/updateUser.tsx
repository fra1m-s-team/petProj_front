import React, { useContext, useState } from 'react';
import {
	Button,
	TextInput,
	Container,
	Title,
	Alert,
	Group,
} from '@mantine/core';
import { Context } from '../main';
import { error } from 'console';

const UpdateUserPage = () => {
	const [email, setEmail] = useState('');
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [code, setCode] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const { store } = useContext(Context);
	const [errors, setErrors] = useState<{
		email?: string;
		newPassword?: string;
		oldPassword?: string;
		confirmNewPassword?: string;
		code?: string;
	}>({});

	const updateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setErrorMessage('');

		if (newPassword !== confirmNewPassword) {
			setErrors({ confirmNewPassword: 'Пароли не совпадают' });
			return;
		}
		try {
			await store.updateUser(email, newPassword, oldPassword, Number(code));
		} catch (err: any) {
			const serverErrors = err.response?.data || [];
			const fieldErrors: {
				email?: string;
				newPassword?: string;
				oldPassword?: string;
				code?: string;
			} = {};

			// Обрабатываем ошибки с сервера и добавляем их к соответствующим полям
			if (Array.isArray(serverErrors)) {
				serverErrors.forEach((error: string) => {
					const errorKey = error.split('-')[0].trim();
					const errorMessage = error.split('-')[1].trim();
					console.log(errorMessage);

					switch (errorKey) {
						case 'email':
							fieldErrors.email = errorMessage;
							break;
						case 'password':
							fieldErrors.newPassword = errorMessage;
							break;
						case 'code':
							fieldErrors.code = errorMessage;
							break;
						default:
							// Обработка неизвестных ошибок, если необходимо
							break;
					}
				});
				setErrors(fieldErrors);
			}
			setErrorMessage(err.response?.data?.message || 'Неизвестная ошибка'); // Устанавливаем сообщение об ошибке
		}
	};

	const handleSendCode = async () => {
		try {
			await store.sendCode();
			setSuccessMessage('Код успешно отправлен на вашу почту!');
		} catch (err: any) {
			setErrorMessage(
				err.response?.data?.message || 'Ошибка при отправке кода'
			);
		}
	};

	return (
		<Container size={420} my={40}>
			<Title order={1}>Сброс пароля</Title>
			{errorMessage && (
				<Alert color='red' mb='md'>
					{errorMessage}
				</Alert>
			)}
			{successMessage && (
				<Alert color='green' mb='md'>
					{successMessage}
				</Alert>
			)}

			<form onSubmit={updateUser}>
				<TextInput
					label='Email'
					placeholder='your@email.com'
					required
					value={email}
					onChange={e => setEmail(e.currentTarget.value)}
					mb='md'
					error={errors.email}
				/>

				<TextInput
					label='Старый пароль'
					placeholder='Ваш старый пароль'
					required
					value={oldPassword}
					onChange={e => setOldPassword(e.currentTarget.value)}
					mb='md'
					error={errors.oldPassword}
				/>

				<TextInput
					label='Новый пароль'
					placeholder='Ваш новый пароль'
					required
					value={newPassword}
					onChange={e => setNewPassword(e.currentTarget.value)}
					mb='md'
					error={errors.newPassword}
				/>

				<TextInput
					label='Подтвердите новый пароль'
					placeholder='Подтвердите ваш новый пароль'
					required
					value={confirmNewPassword}
					onChange={e => setConfirmNewPassword(e.currentTarget.value)}
					mb='md'
					error={errors.confirmNewPassword || errors.newPassword}
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
					Обновить пароль
				</Button>
			</form>
		</Container>
	);
};

export default UpdateUserPage;
