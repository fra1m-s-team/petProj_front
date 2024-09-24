import $api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { RegResponse } from '../models/response/RegResponse';

export default class AuthService {
	static async auth(
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('/user/auth', { email, password });
	}

	static async registration(
		name: string,
		email: string,
		password: string
	): Promise<AxiosResponse<RegResponse>> {
		return $api.post<RegResponse>('/user/registration', {
			name,
			email,
			password,
		});
	}

	static async logout(): Promise<null> {
		return $api.post('/user/logout');
	}
}
