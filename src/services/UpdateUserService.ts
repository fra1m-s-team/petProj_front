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

	//FIXME: Add response 
	static async sendCode(email: string) {
		return $api.post('/user/send-code', { email });
	}

	static async resetPassword(email: string, newPassword: string, code: number) {
		return $api.patch('/user/reset', {
			email,
			newPassword,
			code,
		});
	}
}
