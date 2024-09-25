import { AxiosResponse } from 'axios';
import $api from '../http';

export default class UpdateUserService {
	static async updateUser(
		email: string,
		newPassword: string,
		password: string,
		code: number
	): Promise<AxiosResponse<any>> {
		return $api.patch('/user/patch', {
			email,
			newPassword,
			password,
			code,
		});
	}

	static async sendCode() {
		return $api.post('/user/send-code');
	}
}
