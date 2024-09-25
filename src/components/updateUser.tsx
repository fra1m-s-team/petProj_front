import React, { useContext, useState } from 'react';
import {
	Button,
	TextInput,
	Container,
	Title,
	Alert,
	Group,
	PasswordInput,
	Popover,
	Progress,
} from '@mantine/core';
import { Context } from '../main';
import {
	requirements,
	getStrength,
	PasswordRequirement,
} from '../utils/PasswordUtils';

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
	const [popoverOpened, setPopoverOpened] = useState(false);

	const updateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setErrorMessage('');
		setSuccessMessage('');

		if (newPassword !== confirmNewPassword) {
			setErrors({ confirmNewPassword: 'Пароли не совпадают' });
			return;
		}

		try {
			await store.updateUser(email, newPassword, oldPassword, Number(code));
			setSuccessMessage('Пароль успешно обновлен!');
		} catch (err: any) {
			const serverErrors = err.response?.data?.errors || [];
			const fieldErrors: {
				email?: string;
				newPassword?: string;
				oldPassword?: string;
				code?: string;
			} = {};

			if (Array.isArray(serverErrors)) {
				serverErrors.forEach((error: any) => {
					const [errorKey, errorMessage] = error
						.split('-')
						.map((e: string) => e.trim());
					switch (errorKey) {
						case 'email':
							fieldErrors.email = errorMessage;
							break;
						case 'password':
							fieldErrors.newPassword = errorMessage;
							break;
						case 'oldPassword':
							fieldErrors.oldPassword = errorMessage;
							break;
						case 'code':
							fieldErrors.code = errorMessage;
							break;
						default:
							break;
					}
				});
				setErrors(fieldErrors);
			} else {
				setErrorMessage(err.response?.data?.message || 'Неизвестная ошибка');
			}
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

	const handleSendCode = async () => {
		try {
			await store.sendCode(email);
			setSuccessMessage('Код успешно отправлен на вашу почту!');
		} catch (err: any) {
			setErrorMessage(
				err.response?.data?.message || 'Ошибка при отправке кода'
			);
		}
	};

	return (
		<Container size={420} my={40}>
			<Title order={1}>Смена пароля</Title>
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

				<PasswordInput
					label='Старый пароль'
					placeholder='Ваш старый пароль'
					required
					value={oldPassword}
					onChange={e => setOldPassword(e.currentTarget.value)}
					mb='md'
					error={errors.oldPassword}
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
