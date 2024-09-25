import axios from 'axios';
import { IAuthUser } from '../models/response/IAuthUser';
import { makeAutoObservable } from 'mobx';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';
import AuthService from '../services/AuthService';
import UpdateUserService from '../services/UpdateUserService';

export default class Store {
	user = {} as IAuthUser;
	isAuth = false;

	constructor() {
		makeAutoObservable(this);
	}

	setAuth(bool: boolean) {
		this.isAuth = bool;
	}

	setUser(user: IAuthUser) {
		this.user = user;
	}

	async auth(email: string, password: string) {
		try {
			const response = await AuthService.auth(email, password);
			localStorage.setItem('token', response.data.tokens.accesToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (err: any) {
			console.log(err.response);
			throw err;
		}
	}

	async registration(name: string, email: string, password: string) {
		try {
			const response = await AuthService.registration(name, email, password);
			if (response.data.tokens?.accesToken) {
				localStorage.setItem('token', response.data.tokens?.accesToken);
			}
			this.setAuth(true);
			// FIXME: RegResponse не праильный???? may be
			this.setUser(response.data.user);
		} catch (err: any) {
			throw err;
		}
	}

	async logout() {
		try {
			if (localStorage.getItem('token')) {
				await AuthService.logout();
				localStorage.removeItem('token');
				this.setAuth(false);
				this.setUser({} as IAuthUser);
			}
		} catch (err: any) {
			console.log(err.response?.data?.messages);
		}
	}

	async checkAuth() {
		try {
			if (localStorage.getItem('token')) {
				const response = await axios.get<AuthResponse>(
					`${API_URL}/user/refresh`,
					{ withCredentials: true }
				);
				localStorage.setItem('token', response.data.tokens.accesToken);
				this.setAuth(true);
				this.setUser(response.data.user);
			}
		} catch (err: any) {
			this.setAuth(false);
		}
	}

	async updateUser(
		email: string,
		newPassword: string,
		password: string,
		code: number
	) {
		try {
			if (localStorage.getItem('token')) {
				const response = await UpdateUserService.updateUser(
					email,
					newPassword,
					password,
					code
				);
				if (response && response.status === 200) {
					window.location.href = '/auth'; // Редирект на страницу авторизации
				}
			}
		} catch (err: any) {
			throw err;
		}
	}

	async sendCode(email: string) {
		try {
			await UpdateUserService.sendCode(email);
		} catch (err: any) {
			throw err;
		}
	}

	async resetPassword(email: string, newPassword: string, code: number) {
		try {
			const response = await UpdateUserService.resetPassword(
				email,
				newPassword,
				code
			);
			if (response && response.status === 200) {
				window.location.href = '/auth'; // Редирект на страницу авторизации
			}
		} catch (err: any) {
			throw err;
		}
	}
}
